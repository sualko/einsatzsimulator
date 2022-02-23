#!/bin/bash

docker run -v "$(pwd)/nlu:/app" -u "$(id -u):$(id -g)" -p 5005:5005 rasa/rasa:3.0.6-full run --enable-api