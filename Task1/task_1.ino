//Connect led to GPIO5
#define led 5
//Connect button to GPIO2
#define buttonInput 2
//Connect another toggle button to GPIO4
#define toggleButton 4

//All buttons and leds are connected on the other end to the GROUND pin.

bool toggleState = true;

void setup() {
  // put your setup code here, to run once:
  pinMode(led, OUTPUT);
  pinMode(buttonInput, INPUT_PULLUP);
  pinMode(toggleButton, INPUT_PULLUP);
}

void loop() {
  // put your main code here, to run repeatedly:
  int button1 = digitalRead(buttonInput);
  int button2 = digitalRead(toggleButton);

  //Detect if toggle button is pressed
  //Implemet debouncing here
  if (button2 == 0) {
    toggleState = !toggleState;
  }

  //Detect if switch is on, responsive button is pressed or led is togglen on
  if (button1 == 0 || toggleState) {
    digitalWrite(led, HIGH);
  }
  else {
    digitalWrite(led, LOW);
  }

  //Short delay
  delay(100);
}
