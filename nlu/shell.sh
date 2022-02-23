#!/bin/bash

docker run -v "$(pwd)/nlu:/app" -u "$(id -u):$(id -g)" -ti rasa/rasa:3.0.6-full shell