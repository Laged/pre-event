#include "DHT.h"
#define DHTPIN 10

#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

void setup()
{
	Serial.begin(115200);
	Serial.println("Temperature and humidity measurements\n");
	dht.begin();
}

void loop()
{
	delay(2000);
	float h = dht.readHumidity();
	float t = dht.readTemperature();
	if(isnan(h) || isnan(t))
	{
		Serial.println("Read failure\n");
		return;
	}
	float hic = dht.computeHeatIndex(t, h, false);

	Serial.print("Humidity: ");
	Serial.print(h);
	Serial.println("%");
	Serial.print("Temperature: ");
	Serial.print(t);
	Serial.println("C");
	Serial.print("Heat index: ");
	Serial.print(hic);
	Serial.println("C\n");
}
