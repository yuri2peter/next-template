# syntax=docker.io/docker/dockerfile:1

FROM node:22 AS base

# basic setup
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y \
  vim \
  curl \
  git \
  openssh-server