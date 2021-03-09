# Purpose

This repo represents a "sanitized" version of the code for the serverlerless "Happy Landings" minecraft server. Essentially, it just has some IDs and IPs cleaned out. Any API keys or other secrets are retrieved in same way without being hard-coded here.

This was a project for me to keep my React/Redux and javascript skills sharp and test some features of serverless website hosting, including handling some stateful states and dynamic content. Most technical decisions were made more in respect to the tools I wanted exposure to than for the best tool for the job.

# Overview

The website uses Congito Pools for user management and logins. It is built using the React/Redux framework. It uses DynamoDB to track user logins to the server, parameter store for storing several "stateful" values and API Gateway for any dynamic calls.

The purpose of the website is to display the current server status and meta data (version, texture pack, IP address, etc.), displaying current logins, and allowing for starting/stopping the server. In other words, it's a "hub" for managing the server for any users playing on it.
