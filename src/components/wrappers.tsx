import React from 'react';
import { useParams } from 'react-router';

export const withParams = (Component: any) => {
  return function Result(props) { return <Component {...props} params={useParams()} />; };
};
