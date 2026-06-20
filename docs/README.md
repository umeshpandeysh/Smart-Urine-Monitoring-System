# UroSense Documentation

Welcome to the UroSense platform documentation. This directory contains all technical specifications, architecture documents, API references, and deployment guides.

## Contents

| Directory | Description |
| :--- | :--- |
| [architecture/](architecture/README.md) | All system design and architecture documents (Phases 4–18) |
| [api/](api/README.md) | REST API endpoint reference and Supabase schema guide |
| [hardware/](hardware/) | ESP32 wiring, sensor calibration, and BOM |
| [deployment/](deployment/README.md) | Production deployment guide (Vercel + Supabase) |

## Quick Links

- [Architecture Overview](architecture/README.md)
- [Hardware Design Guide](hardware/hardware-design.md)
- [API Reference](api/README.md)
- [Deployment Guide](deployment/README.md)
- [Sensor Integration](hardware/sensor-integration.md)
- [Strip Analysis](hardware/strip-analysis.md)
- [Calibration Guide](hardware/calibration.md)

## Platform Architecture Summary

UroSense is a three-layer system:

1. **IoT Edge Layer** — ESP32 sensor arrays (`firmware/esp32/`)
2. **Cloud API Layer** — Next.js 15 + Supabase (`src/`)
3. **Web Application** — Multi-role dashboards served at runtime

For the full architecture map, see [Architecture Overview](architecture/README.md).
