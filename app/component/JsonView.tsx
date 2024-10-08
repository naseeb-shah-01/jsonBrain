"use client"

import React, { useState } from "react";
import { JSONTree } from "react-json-tree"; // For visualizing JSON
import { TextField, Button, Box, Typography, Grid, Paper } from "@mui/material"; // MUI components

interface ComparisonResult {
  extraInPayload: string[];
  extraInBody: string[];
}

const CompareJSONKeys: React.FC = () => {
  const [jsonA, setJsonA] = useState<string>("");
  const [jsonB, setJsonB] = useState<string>("");
  const [result, setResult] = useState<ComparisonResult>({
    extraInPayload: [],
    extraInBody: [],
  });

  // Function to compare keys in two objects
// Function to compare keys in two objects, handling nested objects or arrays
function compareKeys(objA: any, objB: any) {
  

  const missingInB: string[] = [];
  const missingInA: string[] = [];

  // Helper function to recursively compare nested objects
  function compareNestedKeys(a: any, b: any, path: string = "") {
    const keysA :any= new Set(Object.keys(a));
    const keysB :any = new Set(Object.keys(b));

    // Check keys in A but missing in B
    keysA.forEach((key:any) => {
      const fullPath = path ? `${path}.${key}` : key;
      if (!keysB.has(key)) {
        missingInB.push(fullPath);
      } else if (typeof a[key] === "object" && typeof b[key] === "object") {
        compareNestedKeys(a[key], b[key], fullPath);
      }
    });

    // Check keys in B but missing in A
    keysB.forEach((key:any) => {
      const fullPath = path ? `${path}.${key}` : key;
      if (!keysA.has(key)) {
        missingInA.push(fullPath);
      }
    });
  }

  compareNestedKeys(objA, objB);

  return {
    extraInPayload: missingInB,
    extraInBody: missingInA,
  };
}


  const handleCompare = () => {
    try {
      const parsedA = JSON.parse(jsonA);
      const parsedB = JSON.parse(jsonB);

      // Compare the keys of both objects
      const comparisonResult = compareKeys(parsedA, parsedB);
      setResult(comparisonResult);
    } catch (error) {
      console.log(error);
      alert("Please enter valid JSON in both fields.");
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Compare JSON Keys
      </Typography>

      <Grid container spacing={2}>
        {/* Input for JSON A */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">JSON A</Typography>
            <TextField
              multiline
              rows={10}
              fullWidth
              variant="outlined"
              placeholder="Enter JSON A"
              value={jsonA}
              onChange={(e) => setJsonA(e.target.value)}
              sx={{ backgroundColor: "#f5f5f5" }}
            />
          </Paper>
        </Grid>

        {/* Input for JSON B */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">JSON B</Typography>
            <TextField
              multiline
              rows={10}
              fullWidth
              variant="outlined"
              placeholder="Enter JSON B"
              value={jsonB}
              onChange={(e) => setJsonB(e.target.value)}
              sx={{ backgroundColor: "#f5f5f5" }}
            />
          </Paper>
        </Grid>
      </Grid>

      <Box textAlign="center" mt={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCompare}
          sx={{ width: "200px" }}
        >
          Compare JSON Keys
        </Button>
      </Box>

      {/* Display the result of the comparison */}
      <Grid container spacing={2} mt={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" color="primary">
              Keys in JSON A but missing in JSON B
            </Typography>
            <JSONTree
              data={result.extraInPayload}
              theme="monokai"
              invertTheme={false}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" color="primary">
              Keys in JSON B but missing in JSON A
            </Typography>
            <JSONTree
              data={result.extraInBody}
              theme="monokai"
              invertTheme={false}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompareJSONKeys;
