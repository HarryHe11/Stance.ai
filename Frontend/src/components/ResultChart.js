import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';





const ResultChart = ({ data }) => {
  return (
    <BarChart width={300} height={300} data={data}  >
      <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" type="category" />
        <YAxis type="number"/>
      <Tooltip formatter={(value) => value.toFixed(2)} />
       <Legend  />
      <Bar dataKey="favor" fill="green" name="Favor" barCategoryGap='50%'/>
      <Bar dataKey="against" fill="red" name="Against"  barCategoryGap='50%'/>
      <Bar dataKey="neither" fill="grey" name="Neither"  barCategoryGap='50%'/>
    </BarChart>
  );
};

export default ResultChart;
