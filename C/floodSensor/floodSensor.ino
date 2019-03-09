/*
 * Initialization Flow
 * 1st : Check Power/Battery
 * 2nd : Signal
 * 3rd : Connection Status
 * 
 * Main Function : Get sensor data and trow to server 
 * If failed 5 times retry initialization/reboot
 * 
 *checking hardware status
 *    module
 *    power/battery
 *    sim
 *  
 *checking signal 
 *    signal strength
 *    connection status
 *loop
 *    monitor sensor
 *    if triggered
 *      send sms 3aaae09d4566ada9127c1834084bd9ea.000webhostapp.com/php/updateFlood.php?action=sensorUpdate&sid=1234&level=3
 *                z3jhymjlcg.x10.bz\Y29sbGVjdG9y.php?dXJs=1&cGF0aA=1&ZGF0YQ=1
 *        if error
 *          repeat process
 * 
 */

#include <SoftwareSerial.h>
#include "Adafruit_FONA.h"

#define FONA_TX 5
#define FONA_RX 6
#define FONA_RST 7

SoftwareSerial fonaSS = SoftwareSerial(FONA_TX, FONA_RX); 

Adafruit_FONA fona = Adafruit_FONA(FONA_RST);

int repeat;
char sid[16] = {0};

////////////////////////////////////////////////////////////////////////////

void setup(){
  Serial.begin(115200);
  fonaSS.begin(4800);
  pinMode(9, OUTPUT);
 
  if (!fona.begin(fonaSS)){
    Serial.println(F("SIM800L Module not Found"));
    errorCode(15);
    restartProcess();
  }else{
    Serial.println(F("SIM800L Module Found"));
  }

  uint8_t imeiLen = fona.getIMEI(sid);
  if(imeiLen > 0) {
    Serial.print(F("SIM card IMEI: ")); Serial.println(sid);
  }
  
  fona.setGPRSNetworkSettings(F("internet"), F(""), F(""));
  battCheck();
}

////////////////////////////////////////////////////////////////////////////

void battCheck(){
  uint16_t vbat;
  if (!fona.getBattVoltage(&vbat)){
    Serial.println(F("Failed to read Batt"));
    errorCode(14);
    restartProcess();
  }else{
    Serial.print(F("VBat = ")); Serial.print(vbat); Serial.println(F(" mV"));
    if(vbat < 4000){
      Serial.println(F("Not enought power"));
      errorCode(13);
      restartProcess();
    }
  }
  digitalWrite(11,HIGH);
  signalStatus();
}

void signalStatus(){
  while(1){
    uint8_t n = fona.getRSSI();
    uint8_t stat = fona.getNetworkStatus();
    Serial.print(F("Signal = ")); Serial.println(n);
    if(stat == 1){
      Serial.println("Connected Successfully");
      tone(9,2000);
      digitalWrite(10,HIGH);
      delay(1000);
      tone(9,1000);
      delay(100);
      noTone(9);
      digitalWrite(10,HIGH);
      gprsON();
      break;  
    }else{
      tone(9,1500);
      digitalWrite(10,HIGH);
      delay(100);
      noTone(9);
      digitalWrite(10,LOW);
      delay(1000);
    }
  }
}

void gprsON(){
  delay(5000);
  if (!fona.enableGPRS(true)){
    Serial.println(F("Failed to turn GPRS ON"));
    errorCode(12);
    restartProcess();
  }else{
    Serial.println(F("GPRS ON"));
    startSensor();
  }
}

void startSensor(){
  refreshInbox();
  int retry = 10;
  while(retry){
    int sensor3 = !digitalRead(4);
    int sensor2 = !digitalRead(3);
    int sensor1 = !digitalRead(2);
    int active = 1;
    int inactive = 0;

    Serial.print(F("Sensor 3 : "));Serial.print(sensor3);Serial.print(F(" Sensor2 : "));Serial.print(sensor2);Serial.print(F(" Sensor1 : "));Serial.println(sensor1);
    if(sensor3 == active && sensor2 == active && sensor1 == active){
      sendSensorData("3");
    }else if(sensor3 == inactive && sensor2 == active && sensor1 == active){
      sendSensorData("2");
    }else if(sensor3 == inactive && sensor2 == inactive && sensor1 == active){
      sendSensorData("1");
    }else if(sensor3 == inactive && sensor2 == inactive && sensor1 == inactive){
      sendSensorData("0");
    }else{
      Serial.println("Error Sensor : Jammed");
      errorCode(11);
      retry--;
    }
    delay(5000);
  }
  restartProcess();
}

void refreshInbox(){
  int8_t smsnum = fona.getNumSMS();
  if (smsnum < 0) {
    Serial.println(F("Could not read # SMS"));
  }else{
    if(smsnum >= 10){
      for(int x = smsnum; x > 0; x++){
        fona.deleteSMS(x);  
      }
      Serial.println(F("Inbox Cleared"));
    }else{
      Serial.print(F("Inbox "));
      Serial.println(smsnum);  
    }
  }
}

void sendSensorData(char lvl[1]){
  uint16_t statuscode;
  int16_t length;
  char url[255] = "3aaae09d4566ada9127c1834084bd9ea.000webhostapp.com/php/updateFlood.php?action=sensorUpdate&sid=";
  char url2[20] = "&level=";
  strcat(url,sid);
  strcat(url,url2);
  strcat(url,lvl);
  
  Serial.println(F("Sending Data..."));
  Serial.println(url);
  digitalWrite(10,LOW); 
  digitalWrite(13,HIGH);
  if (!fona.HTTP_GET_start(url, &statuscode, (uint16_t *)&length)) {
    Serial.print(F("Status : "));
    Serial.println(statuscode);
    Serial.println("Failed!");
  }
  Serial.print(F("Status : "));
  Serial.println(statuscode);
  fona.HTTP_GET_end();
  digitalWrite(10,HIGH);
  digitalWrite(13,LOW);
}

void sendSMS(char sendto[21], char message[141]){
  if (!fona.sendSMS(sendto, message)) {
    Serial.println(F("Failed"));
  } else {
    Serial.println(F("Sent!"));
  }
}

////////////////////////////////////////////////////////////////////////////

void errorCode(int code){
  switch(code){
    case 1:errorPattern(0,0,0,1);break;
    case 2:errorPattern(0,0,1,0);break;
    case 3:errorPattern(0,0,1,1);break;
    case 4:errorPattern(0,1,0,0);break;
    case 5:errorPattern(0,1,0,1);break;
    case 6:errorPattern(0,1,1,0);break;
    case 7:errorPattern(0,1,1,1);break;
    case 8:errorPattern(1,0,0,0);break;
    case 9:errorPattern(1,0,0,1);break;
    case 10:errorPattern(1,0,1,0);break;
    case 11:errorPattern(1,0,1,1);break;
    case 12:errorPattern(1,1,0,0);break;
    case 13:errorPattern(1,1,0,1);break;
    case 14:errorPattern(1,1,1,0);break;
    case 15:errorPattern(1,1,1,1);break;
  }
}

void errorPattern(int a,int b,int c,int d){
  repeat = 10;
  while(repeat){
    lightIndication(a,b,c,d);
    tone(9,2000);
    delay(500);
    lightIndication(0,0,0,0);
    noTone(9);
    delay(500);
    repeat--;
  }
}

void lightIndication(int a,int b,int c,int d){
 a == 1 ? digitalWrite(13,HIGH) : digitalWrite(13,LOW); 
 b == 1 ? digitalWrite(12,HIGH) : digitalWrite(12,LOW); 
 c == 1 ? digitalWrite(11,HIGH) : digitalWrite(11,LOW); 
 d == 1 ? digitalWrite(10,HIGH) : digitalWrite(10,LOW); 
}

void restartProcess(){
  lightIndication(0,0,0,0);
  asm volatile ("jmp 0");  
}

void loop(){}
