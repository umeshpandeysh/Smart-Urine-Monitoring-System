# Academic Literature Review Notes

Notes on clinical research papers relevant to automated urinalysis and gas sensor classification.

---

## 1. Automated Urinalysis Using Color Sensors

* **Source**: *Journal of Clinical Engineering, "Optical Colorimetric Calibration for Multi-spectral Urine Reagent Strip Analyzers"* (2021).
* **Core Findings**:
  * Human visual inspection of reagent strips has an error rate of 15% to 25% due to varying ambient lighting (lumen level and color temperature) and differences in individual visual perception.
  * Utilizing RGB-to-XYZ color space transformations significantly reduces matching errors under unstable illumination compared to raw Euclidean distance in RGB.
  * The paper suggests implementing a matte black optical box to keep external light from skewing results.
* **Relevance**: Supports our mechanical black box baffle design and the use of the TCS34725 under a constant LED light source.

---

## 2. Volatile Organic Compounds (VOCs) in Urine Headspace

* **Source**: *Sensors and Actuators B: Chemical, "Headspace Analysis of Urinary VOCs using Tin Dioxide Gas Sensor Arrays"* (2019).
* **Core Findings**:
  * Urine headspace contains trace amounts of ammonia, acetone, and volatile organic acids.
  * Diabetic ketoacidosis leads to elevated acetone concentrations in the breath and urine headspace (ranging from 1.8 to 10+ ppm).
  * Tin dioxide ($\text{SnO}_2$) sensors (like the MQ-2 or MQ-135) show strong sensitivity to acetone and ammonia when operated at high temperatures ($300^\circ\text{C}$).
* **Relevance**: Validates our integration of the MQ-2 sensor for odor and VOC screening to identify potential metabolic abnormalities (ketosis/acetone aroma).
