# Reagent Strip Analysis Workflow

This document details the optical analysis workflow of the **10-parameter urine reagent strip** using the TCS34725 sensor.

---

## 1. The 10 Parameters and Clinical Significance

A standard 10-parameter urine strip contains chemical pads that change color via specific enzymatic or indicator reactions:

| Reagent Pad | Reaction Type | Normal Range | Clinical Implications of Abnormal Readings |
| :--- | :--- | :--- | :--- |
| **Glucose** | Double sequential enzymatic | Negative | High values suggest Diabetes Mellitus or renal glycosuria. |
| **Protein** | Protein-error-of-indicators | Negative / Trace | Proteinuria suggests kidney disease or heavy physical exertion. |
| **Ketones** | Legal's test (Sodium Nitroprusside) | Negative | Ketosis (metabolic shift, fasting, diabetic ketoacidosis). |
| **Blood** | Pseudoperoxidase activity of Hb | Negative | Hematuria (kidney stones, infection, trauma). |
| **Nitrite** | Griess test (diazotization) | Negative | Positive indicates Gram-negative bacterial infection (UTI). |
| **Leukocytes** | Granulocyte esterase activity | Negative | Leukocyturia suggests infection or inflammatory response. |
| **Specific Gravity** | pKa change of polyelectrolytes | 1.005 – 1.030 | Hydration indicator (low: overhydrated; high: dehydrated). |
| **pH** | Double indicator system | 4.5 – 8.0 | High: UTI, respiratory alkalosis. Low: aciduria, starvation. |
| **Bilirubin** | Azo-coupling reaction | Negative | Conjugated bilirubin suggests liver damage or bile duct block. |
| **Urobilinogen** | Ehrlich reaction | 0.2 – 1.0 mg/dL | High: hemolytic anemia, hepatitis. Low: biliary obstruction. |

---

## 2. Optical Detection Method

```
                   [Calibrated White LED]
                             \
                              \ (Incident Light)
                               v
  +------------------ [ Reagent Pad Color ] ------------------+
                               |
                               | (Reflected Light)
                               v
                     [ TCS34725 Color Sensor ]
                               |
                               | (I2C Bus: RGBC Digital Counts)
                               v
                        [ ESP32 Engine ]
```

1. **Illumination Phase**: The RGB light values are highly dependent on incident lighting. The white LED is enabled at a constant brightness via PWM.
2. **Measurement Sweeping**: The strip is mechanically advanced. Each pad is held under the sensor for $200\text{ms}$ to stabilize reading counts.
3. **RGB Normalization**: To prevent errors from overall brightness variations, raw R, G, and B counts are converted into normalized chromaticity values:
   $$r = \frac{R}{R+G+B}, \quad g = \frac{G}{R+G+B}, \quad b = \frac{B}{R+G+B}$$

---

## 3. Classification Algorithm

To map normalized RGB vectors to discrete health grades (e.g., negative, trace, $+1$, $+2$, $+3$), the firmware uses a **Nearest Neighbor Classifier (Euclidean Distance)**.

Given a measured normalized vector $\vec{x} = (r_x, g_x, b_x)$ and a set of calibration reference vectors $\vec{c}_i = (r_i, g_i, b_i)$ for classification level $i$, the algorithm computes the Euclidean distance:
$$D_i = \sqrt{(r_x - r_i)^2 + (g_x - g_i)^2 + (b_x - b_i)^2}$$

The parameter is classified into the level $i$ that minimizes $D_i$:
$$\text{Class} = \arg\min_i (D_i)$$

If the minimum distance $\min(D_i)$ exceeds a pre-defined threshold (e.g., $0.12$), the reading is flagged as "Inconclusive / Calibration Needed" to prevent false outputs due to external lighting errors.
