// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { createCanvas } from "canvas";
// src/setupTests.js
import "jest-canvas-mock";
import { Chart } from "chart.js";

// Mock the HTMLCanvasElement.getContext method
HTMLCanvasElement.prototype.getContext = function () {
  return createCanvas(300, 150).getContext("2d");
};
