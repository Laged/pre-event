//Use a normal button as a toggle switch
//Emil

int m=64, c=0, r, s=1;

void setup()
{
	Serial.begin(115200);
	pinMode(LED_BUILTIN, OUTPUT);
	pinMode(10, INPUT_PULLUP);
	digitalWrite(LED_BUILTIN, s);
}

void loop()
{
	r=digitalRead(10);
	c+=r;
	c=c>m?m:c;
	if(c==m && r==0)
	{
		s^=1;
		c=0;
		digitalWrite(LED_BUILTIN, s);
		Serial.println(millis());
	}
}
