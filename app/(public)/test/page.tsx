"use client"
import React from 'react';

interface Person {
  name: string;
  arr: string[];
}

interface Business {
  title: string;
  business: string;
}

interface BusinessWithView extends Business {
  view: boolean;
}

const compareData = (person: Person, businesses: Business[]): BusinessWithView[] => {
  const result: BusinessWithView[] = [];

  person.arr.forEach(item => {
    const matchedBusiness = businesses.find(business => business.business === item);

    if (matchedBusiness) {
      result.push({ ...matchedBusiness, view: true });
    }
  });

  return result;
};

const MyComponent = () => {
  const person: Person = { name: "renko", arr: ["aba", "something1","something2"] };
  const businesses: Business[] = [
    { title: "Company A", business: "aba" },
    { title: "Company B", business: "something1" },
    { title: "Company C", business: "something3" },
    { title: "Company D", business: "something4" },
  ];

  const result: BusinessWithView[] = compareData(person, businesses);

  return (
    <div>
      <h2>Comparison Result:</h2>
      <ul>
        {result.map((business, index) => (
          <li key={index}>
            {business.title}: {business.business} - View: {business.view.toString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyComponent;