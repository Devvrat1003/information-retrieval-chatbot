#!/usr/bin/env bash

# Update package lists and install eSpeak-ng
apt-get update
apt-get install -y espeak-ng

# Install Python dependencies
pip install --no-cache-dir -r requirements.txt
