#include <Adafruit_NeoPixel.h>
#include "DHT.h"
#define DHTPIN 4
#define PIXELPIN 5
#define PIXELS 1
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);
Adafruit_NeoPixel pixels = Adafruit_NeoPixel(PIXELS, PIXELPIN, NEO_GRB + NEO_KHZ800);

unsigned long t=0;
unsigned long wait=2000;
struct colour
{
	float c[3];
};

struct colour c1={{0,255,0}}, c2={{255,127,0}}, c3={{0,255,255}}, c4={{255,0,0}}, tc={{0,0,0}}, cc={{0,0,0}};
char cn[3]={'r', 'g', 'b'};

void setup()
{
	Serial.begin(115200);
	Serial.println("\nTemperature and humidity measurements\n");
	dht.begin();
	pixels.begin();
}

void loop()
{
	int i;
	if((t+wait)<millis())
	{
		t=millis();
		float h = dht.readHumidity();
		float t = dht.readTemperature();
		if(!isnan(h) && !isnan(t))
		{
			Serial.print("Humidity: ");
			Serial.print(h);
			Serial.println("%");
			Serial.print("Temperature: ");
			Serial.print(t);
			Serial.println("C");

			t=t<20?20:t;
			t=t>40?40:t;
			t-=20;
			t/=20;

			h=h<0?0:h;
			h=h>100?100:h;
			h/=100;
			for(i=0; i<3; i++)
			{
				tc.c[i]=((1-h)*(t*c4.c[i]+(1-t)*c3.c[i])+h*(t*c2.c[i]+(1-t)*c1.c[i]));
				Serial.print(cn[i]);
				Serial.print("=");
				Serial.print((unsigned char)tc.c[i]);
				Serial.print(" ");
			}
			Serial.println();
		}
		else
		{
			Serial.println("Read failure");
		}
	}
	for(i=0; i<3; i++)
	{
		if(tc.c[i]>cc.c[i])
		{
			cc.c[i]++;
		}
		else
		{
			cc.c[i]--;
		}
	}
	pixels.setPixelColor(0, (unsigned char)cc.c[0], (unsigned char)cc.c[1], (unsigned char)cc.c[2]);
	pixels.show();
	delay(10);
}
