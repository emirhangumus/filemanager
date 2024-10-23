#!/bin/bash

if [ -z "$FM_USERNAME" ]; then
    echo "Error: FM_USERNAME is not set."
    echo "Usage: FM_USERNAME=username ./userSetup.sh"
    exit 1
fi

sudo adduser "$FM_USERNAME" --disabled-login --gecos ""

if [ $? -eq 0 ]; then
    echo "User $FM_USERNAME added successfully."
    sudo setquota -u "$FM_USERNAME" 1024M 1500M 0 0 /dev/sda2

    if [ $? -eq 0 ]; then
        echo "Quota set successfully for $FM_USERNAME."
        exit 0
    else
        echo "Error setting quota for $FM_USERNAME."
        exit 1
    fi
else
    echo "Error adding user $FM_USERNAME."
    exit 1
fi