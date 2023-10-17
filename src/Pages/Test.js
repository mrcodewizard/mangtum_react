import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { getAboutus } from '../store/home'
export const Test = () => {
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(getAboutus());
  }, []);

  const state = useSelector(state => state.home)
  const About_us = state.Aboutus;
  return (
    <div>Test</div>
  )
}
export default Test;