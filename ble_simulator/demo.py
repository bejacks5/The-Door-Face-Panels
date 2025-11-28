from BLE_Simulator import *
import time

'''
    Main simulation of BLE:

    Peripheral broadcasts its presence and capabilities
    The central listens and discovers the peripheral
    The central sends a connection request with proposed parameters
    The peripheral accepts the request
    Both devices negotiate connection parameters
    The link is secured and ready for data exchange
'''

print(f"START OF BLE HANDSHAKE SIMULATION")
time.sleep(1)

# Creation of devices
smart_device = SmartDevice("DoorFace Door")
phone = Phone("iPhone 13")

# Peripheral starts advertising
smart_device.start_advertising
time.sleep(1)

# Central starts scanning
phone.start_scanning()
time.sleep(1)

# Central discovers the Peripheral
phone.discover_device(smart_device)
time.sleep(1)

# Central initiates the connection to the Peripheral
phone.initiate_connection(smart_device)
time.sleep(1)

# If the peripheral accepts the connection,
# exchange parameters and establish the 
# connection
if smart_device.accept_connection(phone):
    time.sleep(1)
    params = smart_device.exchange_parameters()
    time.sleep(1)
    phone.establish_connection()

print(f"\nEND OF BLE HANDSHAKE SIMULATION")