//控制灯光模块
#include <Adafruit_NeoPixel.h>
#define PIXEL_PIN    6    // Digital IO pin connected to the NeoPixels.
#define PIXEL_COUNT  6
Adafruit_NeoPixel strip = Adafruit_NeoPixel(PIXEL_COUNT, PIXEL_PIN, NEO_GRB + NEO_KHZ800);

//控制Nfc模块
#include <Wire.h>
#include <Adafruit_NFCShield_I2C.h>
#define IRQ   (2)
Adafruit_NFCShield_I2C nfc(IRQ); //nfc IIC通信？

//控制wifi模块
#include "ESP8266.h"
//CoreUSB UART Port: [Serial1] [D0,D1]  wifi串口通信
#if defined(__AVR_ATmega32U4__) //ATmega32U4---coreusb 版本号
#define EspSerial Serial1
#define UARTSPEED  115200
#endif

//控制继电器的模块
#define RELAY_PIN 8 //继电器的接口

#define SSID        "CCMC" //无线网账号
#define PASSWORD    "qwertyuiop" //无线网密码
#define HOST_NAME   "59.110.141.67" //ip地址，自己搭建的服务器的IP地址
#define HOST_PORT   (3000) //端口号

ESP8266 wifi(&EspSerial);

void setup(void) {
  Serial.begin(115200);
  //while (!Serial); 用于串口监视方便，如果不打开串口监视器，就无法运行下面的代码，但对于以后需要脱离电脑运行时，此代码一定要注释，否则程序无法运行！
  
  Serial.println(F("Hello!")); 
  //led模块的初始化
  strip.begin();
  strip.show(); //初始化时是灯灭的情况

  //初始化nfc模块
  nfc.begin();
  nfc.setPassiveActivationRetries(0xFF);
  nfc.SAMConfig();
  
  ERR:
  //初始化WiFi模块
  wifi.setUart(UARTSPEED, DEFAULT_PATTERN);
  EspSerial.begin(UARTSPEED);//设值波特率
  delay(100);

  if (wifi.joinAP(SSID, PASSWORD)) {
    Serial.print(F("Join AP success\r\n"));
    pinMode(RELAY_PIN, OUTPUT);
    digitalWrite(RELAY_PIN, HIGH); //初始化继电器接口为高电平
  } else {
    Serial.print(F("Join AP failure\r\n"));
    goto ERR;
  }
}

void loop(void) {
  boolean success;
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };  // Buffer to store the returned UID
  uint8_t uidLength;                        // Length of the UID (4 or 7 bytes depending on ISO14443A card type)

  // Wait for an ISO14443A type cards (Mifare, etc.).  When one is found
  // 'uid' will be populated with the UID, and uidLength will indicate
  // if the uid is 4 bytes (Mifare Classic) or 7 bytes (Mifare Ultralight)
  success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, &uid[0], &uidLength);

  if (success) {
    String postString;
    String inString = "";
    Serial.println(F("Found a card!"));
    for (uint8_t i=0; i < uidLength; i++) //对读取的卡号进行编码转换为唯一对应的字母字符串
    {
      inString += (char)(uid[i]/16+97);
      inString += (char)(uid[i]%16+97);
    }
  Serial.println(inString); 

  if (wifi.createTCP(HOST_NAME, HOST_PORT)) {
    Serial.println(F("create tcp ok\r\n"));
    uint8_t buffer[256+128] = {0}; //用于存放数据的数组，尽量小的设置，不然其会占用大量空间！
    postString="GET http://59.110.141.67:3000/lock?physical_id=";
    postString+=inString;
    postString+="&room_id=101";
    postString+=" HTTP/1.1\r\nHost: 59.110.141.67:3000\r\nConnection: close\r\n\r\n";
    const char *hello = postString.c_str();
    //char *hello = "GET http://192.168.43.215/php/Try/get.php?id=1 HTTP/1.1\r\nHost: 192.168.43.215\r\nConnection: close\r\n\r\n";
    //当使用Keep-Alive模式（又称持久连接、连接重用）时，Keep-Alive功能使客户端到服务器端的连接持续有效，当出现对服务器的后继请求时，Keep-Alive功能避免了建立或者重新建立连接。
    //此处此处由于只获取一次数据，所以无需关心后继请求，故而为Connection: close
    
    wifi.send((const uint8_t*)hello, strlen(hello));//将信息头发送出去：内容，长度 //bool send(const uint8_t *buffer, uint32_t len);
    hello = NULL; //释放内存
  
    uint32_t len = wifi.recv(buffer, sizeof(buffer), 10000);
    Serial.println(freeRam());//打印剩余的内存
   /* if (len > 0) {
    Serial.print(F("Received:["));
    for (uint32_t i = 0; i < len; i++) {
      Serial.print((char)buffer[i]);
    }
    Serial.print("]\r\n");
    }*/
    uint8_t a = Print(buffer, len); //对于接受的数据进行处理
    Serial.println(char(a));
    if (a == 49) {
      colorSet(strip.Color(0, 255, 0));// 绿灯，低电平有效，“ 255-r ”
      delay(600);
      colorSet(strip.Color(0, 0, 0)); //熄灭
      digitalWrite(RELAY_PIN, LOW); //匹配成功，低电平
      delay(1500);
      digitalWrite(RELAY_PIN, HIGH);//卡刷完后，再给高电平
    }
    else{
      colorSet(strip.Color(255, 0, 0));// 红灯，低电平有效，“ 255-r ”
      delay(1000);
      colorSet(strip.Color(0, 0, 0)); //熄灭
    }
  } 
  else {
      Serial.print("create tcp err\r\n");
      colorSet(strip.Color(255, 0, 0));// 红灯，低电平有效，“ 255-r ”
      delay(1000);
      colorSet(strip.Color(0, 0, 0)); //熄灭
      }
  }
}

uint8_t Print(uint8_t * buffer, uint32_t len)//对于服务器端返回的报文进行处理，剥去报头
{
  if (len > 0)
  {
    uint32_t i = 0; //定义整型变量 i
    while ((i < len - 1) && (!((buffer[i] == 13) && (buffer[i + 1] == 10) && (buffer[i + 2] == 13) && (buffer[i + 3] == 10)))) //用于判别信息头同时只获取信息头后的值
    {
      i++;
    }
    //由于此处我只打算获取权限，1代表可以，0代表不可以，所以只获取一个字符即可
    return buffer[i + 4];
  }
}

void colorSet(uint32_t c) //常用的颜色设置函数，c为4字节，32bit长度
{
  for (uint16_t i = 0; i < strip.numPixels(); i++)
  {
    strip.setPixelColor(i, c);
    strip.show();
  }
}

int freeRam() //用于查询剩余的内存，使用wifi模块一定要保证剩余内存在600B以上
{ 
  extern int __heap_start, *__brkval; 
  int v; 
  return (int) &v - (__brkval == 0 ? (int) &__heap_start : (int) __brkval); 
}

