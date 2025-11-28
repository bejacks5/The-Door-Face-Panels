import random
import time
from enum import Enum
from dataclasses import dataclass

'''
    Bluetooth Low Energy

    NOTICE: Since this is purely a demonstration, it will not have an 
    actual functional BLE with bluetooth. To implement that, it would 
    need to use bleak and asyncio (for python).

    https://bleak.readthedocs.io/en/latest/

'''

class BLE_State(Enum):
    # BLE connection states, which can be
    # standby, advertising, scanning, initiating or connection
    STANDBY = "Standby"
    ADVERTISING = "Advertising"
    SCANNING = "Scanning"
    INITIATING = "Initiating"
    CONNECTION = "Connection"

@dataclass
class BLE_Device:
    # This will represent a BLE device
    # using only basic properties
    name: str
    address: str
    device_type: str
    state: BLE_State = BLE_State.STANDBY

class SmartDevice:
    # This will represent the BLE peripheral/smart device
    # self.device represents the BLE device
    # self.advertising_data represents the BLE device's advertisement
    # this include the device name, the services, and tx_power (indicates BLE range)
    # services always includes genertic access, device information as standards

    def __init__(self, name: str):
        self.device = BLE_Device(
            name=name,
            address=self.generate_mac(),
            device_type="Peripheral"
        )
        self.advertising_data = {            
                "device_name": name,
                "services": ["Generic Access", "Device Information"],
                "tx_power": -10
        }

    def generate_mac(self) -> str:
        # Generates a random MAC address
        # for initiating SmartDevice
        return f"{random.randint(0, 255):02x}:{random.randint(0, 255):02x}:{random.randint(0, 255):02x}:{random.randint(0, 255):02x}:{random.randint(0, 255):02x}:{random.randint(0, 255):02x}"
    
    def start_advertising(self):
        # Represents the advertising state of the BLE device

        print(f"\n{'='*40}\n")
        print(f"PERIPHERAL DEVICE: {self.device.name} - ADVERTISING")
        self.device.state = BLE_State.ADVERTISING

    def accept_connection(self, phone) -> bool:
        # Represents the BLE device accepting
        # a phone connection

        print(f"\n{'='*40}\n")
        print(f"PERIPHERAL DEVICE: {self.device.name} - ACCEPTING")
        print(f"Connection request from {phone.device.name}")

        time.sleep(0.5)
        print(f"Accepted connection from {phone.device.name}")
        self.device.state = BLE_State.CONNECTION

        return True

    def exchange_parameters(self):
        # After a BLE accepts a connection, parameters 
        # must be exchanged
        # we will use default ones

        print(f"\n{'='*40}\n")
        print(f"PERIPHERAL DEVICE: {self.device.name} - EXCHANGING PARAMETERS")

        params = {
            "Connection Interval": "40 ms",     # interval between two consecutive connections
            "Slave Latency": "0",               # number of connections that the device can skip
            "Supervision Timeout": "4000ms",    # maximum time between two connections events before timeout
            "MTU Size": "23 bytes"              # largest packet size that can be transmitted
        }

        print(f"\nConnection parameters: ")
        for key, value in params.items():
            print(f"  {key}: {value}")

        return params
    
class Phone:
    # This will represent the BLE central/phone connecting to BLE device
    # self.device represents the BLE device
    # self.discovered devices represents bluetooth devices that we connect to

    def __init__(self, name: str):
        self.device = BLE_Device(
            name=name,
            address=self.generate_mac(),
            device_type="Central"
        )
        self.discovered_devices = []

    def generate_mac(self) -> str:
        # Generates a random MAC address
        # for initiating Phone
        return f"{random.randint(0, 255):02x}:{random.randint(0, 255):02x}:{random.randint(0, 255):02x}:{random.randint(0, 255):02x}:{random.randint(0, 255):02x}:{random.randint(0, 255):02x}"
    
    def start_scanning(self):
        # Represents the Central scanning for devices

        print(f"\n{'='*40}\n")
        print(f"CENTRAL DEVICE: {self.device.name} - SCANNING")

        self.device.state = BLE_State.SCANNING

    def discover_device(self, smart_device: SmartDevice):
        # Represents the Central discovering a device
        # RSSI - received signal strength indicator

        print(f"\n{'='*40}\n")
        print(f"CENTRAL DEVICE: {self.device.name} - DISCOVERED A DEVICE")
        print(f"Name: {smart_device.device.name}")
        print(f"Address: {smart_device.device.address}")
        print(f"RSSI: {random.randint(-70, -40)} dBm")
        self.discovered_devices.append(smart_device)

    def initiate_connection(self, smart_device: SmartDevice):
        # Represents the Central initiating a connection

        print(f"\n{'='*40}\n")
        print(f"CENTRAL DEVICE: {self.device.name} - INITIATING CONNECTION")

        self.device.state = BLE_State.INITIATING
        print(f"Sending connection request to: {smart_device.device.name}")
        print(f"Target address: {smart_device.device.address}")
        print(f"Proposed parameters: ")
        print(f"  Connection Interval: 40 ms")
        print(f"  Connection Window: 15 ms")
        print(f"  Supervision Timeout: 4000ms")

    def establish_connection(self):
        # Represents the connection being finalized

        print(f"\n{'='*40}\n")
        print(f"CENTRAL DEVICE: {self.device.name} - CONNECTION ESTABLISHED")

        self.device.state = BLE_State.CONNECTION
        print(f"BLE connection successfully established.")
