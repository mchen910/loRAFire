# Website and API for Synopsys Science Fair 22-23 Project
### Robust, Lora-based Mesh Network - Solution for Wildfire Detection and Growth Forecast through Custom Prediction Algorithm
---
### Web Client: 
![image](https://user-images.githubusercontent.com/77950550/224387430-be3252d5-e3ed-4d2b-94e6-9bb13b9a8d2d.png)

---
### IoT Sensor Module:
![image](https://github.com/beranki/loRAFire/blob/master/pictures/Hardware%20Picture%20-%20Close-up.jpg)

---
### Developer's Notes:
API routes in `routes/api.js`
API implementation & documentation in `controllers/[module].js` 
Databse schematics in `models/[schema].js`
Web Client source in `client/src/`

API hosted on port `8000` (change via .env file), Client hosted on port `3000`

---

## Motivations

The ever more frequent natural disasters are harmful tragedies that develop from an unfortunate environmental coincidence. Some disasters have quantifiable signs that can be compiled into a measure of risk. Though the sensor technologies exist, there lacks a system to connect a large network of sensors to survey the environment. The project aims to develop a software framework for IoT sensor networks to be used in environmental surveillance. It presents a networking protocol capable of maintaining a mesh topology, allowing for a greater covered area.

Past IoT solutions lacked an extensible topology and a long-ranged radio, often only used to cover small areas. Most IoT are not designed to span very large areas – their architectures typically only implement a hub-and-spoke topology, limiting the network diameter by the radio range. Past radio modules typically have a range-to-power tradeoff, and as such most IoT solutions do not use modules with great peer-to-peer range.
Contemporary techniques in the detection of wildfires – such as aerial, visual, or infrared – require the fire to have already grown considerably.

## Materials & Methods:
 - __Arduino Nano__: small, low power, extensible microcontroller
 - __ESP-8266__: similar to the nano, but with WiFi capabilities.
 - __Ra-02 LoRa Module__: SPI interface, long-range, low-power module with interrupts.
 - __MongoDB & Mongoose__: Development database and its Node.js interfacing library.
 - __Express.js__: A web server framework for Node.js.
 - __React.js__: JS library for reactive web pages.
 - __Google Maps API__: API to display interactive maps.
 - __Pandas__: Python library for handling mass data.

---

## Setup:
### Installation:
- Clone repo and install neccesary packages with `npm install` for both the root and `client` folders.
### Database Setup (Mongo DB)
- Sign up for a MongoDB account, create a data cluster, and copy your connection key into `.env` under the `DATABASE_URI` section.

### Hardware Setup:
- Configure all nodes to run on the same channel.
- Write Network credentials into the gateways' EEPROM.
- Set correct server address in gateways' source file.

### Google Maps API:
- Project employs Google Maps API to visualize geographical data to impose node markers upon. In order to set this up, follow this post from Google: https://support.google.com/looker-studio/answer/109z8075?hl=en
- After ensuring all has been set up, enter your API key on line 24 of *src/pages/components/Map.js*.

![image](https://user-images.githubusercontent.com/77950550/224384180-e7780625-506f-49b2-91b1-cc9645b2b296.png)

## Hosting the project:
- API and client are run on different ports. If using VS, split terminal into two seperate processes, and run the following commands <em>in the root dir</em>: <br>
1) `npm run start` //starts server
2) `npm run client` //starts client

## Hardware Source Files:
- Repository for LoRaNet Library: [repo](https://github.com/PaddingProductions/LoRaNetLib) 
- Repository for LoRaNet Nodes, Gateways & Utilities: [repo](https://github.com/PaddingProductions/LoRaNet)
- Repository for MQ2 Sensor Driver: [repo](https://github.com/PaddingProductions/MQ2-driver)
---

<h2><a href="https://github.com/beranki/loRAFire/files/10952026/Engineering.Notebook.pdf" class="topic" style="padding-bottom:40px; font-size: 200px;" >Engineering Notebook: </a></h2>

![](https://user-images.githubusercontent.com/77950550/224572047-0276ec26-0316-41ac-9474-91e6d7daa42c.jpg)
