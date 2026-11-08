export interface Lesson {
  id: number;
  title: string;
  eyebrow: string;
  summary: string;
  explanation: string;
  componentId: string;
  keyTakeaways: string[];
  demoLabel: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export const lessons: Lesson[] = [
  {
    id: 1,
    title: "What is ESP32?",
    eyebrow: "Meet the microcontroller",
    summary: "The ESP32 is a programmable microcontroller with built-in Wi-Fi and Bluetooth.",
    explanation:
      "An ESP32 runs your code, reads sensors, and controls outputs such as LEDs and relays. Its wireless features let devices exchange data on a local network or through the internet when a separate upstream connection is available.",
    componentId: "esp32",
    keyTakeaways: [
      "A microcontroller executes the program stored on the board.",
      "GPIO pins connect the ESP32 to external components.",
      "Built-in Wi-Fi supports local device communication without requiring internet access.",
    ],
    demoLabel: "Explore the ESP32",
  },
  {
    id: 2,
    title: "Understanding GPIO",
    eyebrow: "Inputs and outputs",
    summary: "GPIO pins let the ESP32 read signals and control connected components.",
    explanation:
      "A General-Purpose Input/Output pin can be configured by software. In this lab, GPIO 25 drives the red LED, GPIO 26 drives the yellow LED, GPIO 27 drives the green LED, and GPIO 23 drives the relay input. An output set HIGH is approximately 3.3 V; an output set LOW is approximately 0 V.",
    componentId: "gpio",
    keyTakeaways: [
      "Red, yellow, and green LEDs use GPIO 25, 26, and 27 respectively.",
      "The relay input is connected to GPIO 23.",
      "ESP32 logic uses 3.3 V, not 5 V.",
    ],
    demoLabel: "Trace the GPIO connections",
  },
  {
    id: 3,
    title: "How LEDs Work",
    eyebrow: "Light from a GPIO pin",
    summary: "An LED emits light when current flows through it in the correct direction.",
    explanation:
      "The anode connects toward the positive side and the cathode toward ground. A current-limiting resistor protects both the LED and the ESP32 pin. Setting the assigned GPIO HIGH supplies about 3.3 V to turn the LED on; setting it LOW turns it off.",
    componentId: "led",
    keyTakeaways: [
      "LED polarity matters: anode and cathode must be oriented correctly.",
      "Always use a suitable current-limiting resistor.",
      "The lab LEDs use GPIO 25 for red, GPIO 26 for yellow, and GPIO 27 for green.",
    ],
    demoLabel: "Switch the LEDs",
  },
  {
    id: 4,
    title: "What is a Relay?",
    eyebrow: "Control another circuit",
    summary: "A relay uses a low-power control signal to switch a separate electrical circuit.",
    explanation:
      "The ESP32 sends a control signal from GPIO 23 to the relay module input. The relay contacts then open or close the load circuit. In this lab, the relay module uses a 5 V supply that is separate from the ESP32's 3.3 V logic. Never power the relay coil from a GPIO pin, and ensure the module accepts 3.3 V control signals.",
    componentId: "relay",
    keyTakeaways: [
      "GPIO 23 controls the relay module input.",
      "The relay module requires a separate 5 V supply, distinct from 3.3 V logic power.",
      "Relay contacts switch the load; a GPIO pin must not supply coil current.",
    ],
    demoLabel: "Activate the relay",
  },
  {
    id: 5,
    title: "Understanding I2C",
    eyebrow: "Two wires, many devices",
    summary: "I2C lets a controller exchange data with addressed devices over two signal wires.",
    explanation:
      "The ESP32 acts as the I2C controller. SDA carries data and SCL carries the clock; both connect to every device on the bus. This lab uses GPIO 21 for SDA and GPIO 22 for SCL. Each device has an address so the controller can select which sensor receives or returns data.",
    componentId: "i2c",
    keyTakeaways: [
      "SDA is GPIO 21 and SCL is GPIO 22 in this lab.",
      "SDA transfers data while SCL provides timing.",
      "Device addresses allow multiple I2C devices to share a bus.",
    ],
    demoLabel: "Inspect the I2C bus",
  },
  {
    id: 6,
    title: "SHT31 Temperature and Humidity Sensor",
    eyebrow: "Measure the environment",
    summary: "The SHT31 provides digital temperature and relative humidity readings over I2C.",
    explanation:
      "The ESP32 requests a measurement from the SHT31 and reads the returned data through SDA and SCL. The sensor reports temperature, commonly converted to degrees Celsius, and relative humidity as a percentage. Unlike a simple analog sensor, it communicates digitally using its I2C address.",
    componentId: "sht31",
    keyTakeaways: [
      "The SHT31 measures both temperature and relative humidity.",
      "It communicates digitally over I2C.",
      "Connect SDA to GPIO 21 and SCL to GPIO 22.",
    ],
    demoLabel: "Read the SHT31",
  },
  {
    id: 7,
    title: "Wi-Fi Access Point",
    eyebrow: "Create a local network",
    summary: "The ESP32 can host a Wi-Fi network that nearby devices join directly.",
    explanation:
      "In access point mode, the ESP32 broadcasts its own network name and accepts local connections. A connected phone or computer can open the lab dashboard at the default address 192.168.4.1. This direct local connection works without internet access because the dashboard is served by the ESP32 itself.",
    componentId: "wifi-ap",
    keyTakeaways: [
      "Access point mode creates a network instead of joining an existing router.",
      "The ESP32 default access point address is 192.168.4.1.",
      "No internet connection is required for local dashboard access.",
    ],
    demoLabel: "Connect to the local access point",
  },
  {
    id: 8,
    title: "How IoT Dashboard Communication Works",
    eyebrow: "From browser to hardware",
    summary: "A dashboard exchanges requests and data with the ESP32 over the local network.",
    explanation:
      "The browser requests sensor readings from the ESP32 and displays the responses. When you operate a control, the browser sends a request identifying the desired output state, and the ESP32 updates the corresponding GPIO. On the local access point, this communication stays between the browser and ESP32 and does not require the internet.",
    componentId: "dashboard",
    keyTakeaways: [
      "Requests carry commands or ask for current sensor data.",
      "Responses let the dashboard display readings and output states.",
      "Local Wi-Fi communication can operate entirely without internet access.",
    ],
    demoLabel: "Follow a dashboard request",
  },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Which GPIO controls the red LED in this lab?",
    options: ["GPIO 25", "GPIO 26", "GPIO 27"],
    answer: 0,
    explanation: "The red LED is connected to GPIO 25; yellow uses GPIO 26 and green uses GPIO 27.",
  },
  {
    id: 2,
    question: "Which communication protocol does the SHT31 use in this lab?",
    options: ["I2C", "UART", "SPI"],
    answer: 0,
    explanation: "The SHT31 communicates over I2C using SDA on GPIO 21 and SCL on GPIO 22.",
  },
  {
    id: 3,
    question: "What is the ESP32's default IP address in access point mode?",
    options: ["192.168.1.1", "192.168.4.1", "10.0.0.1"],
    answer: 1,
    explanation: "The default ESP32 soft access point IP address is 192.168.4.1.",
  },
  {
    id: 4,
    question: "Approximately what voltage does an ESP32 GPIO output produce when set HIGH?",
    options: ["1.8 V", "3.3 V", "5 V"],
    answer: 1,
    explanation: "The ESP32 uses 3.3 V logic, so a HIGH output is approximately 3.3 V.",
  },
  {
    id: 5,
    question: "What is the purpose of the relay in this lab?",
    options: [
      "To measure temperature and humidity",
      "To regulate the ESP32 logic voltage",
      "To switch a separate electrical circuit using a control signal",
    ],
    answer: 2,
    explanation: "The relay lets the GPIO 23 control signal open or close a separate load circuit; its module is powered by a separate 5 V supply.",
  },
  {
    id: 6,
    question: "Can the ESP32 dashboard work through its local access point without internet access?",
    options: [
      "Yes, because the browser and ESP32 communicate directly on the local network",
      "No, every Wi-Fi connection requires internet access",
      "Only if the SHT31 is disconnected",
    ],
    answer: 0,
    explanation: "Yes. The ESP32 serves the dashboard locally, so no internet connection is required.",
  },
];
