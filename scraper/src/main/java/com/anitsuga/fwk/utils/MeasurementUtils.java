package com.anitsuga.fwk.utils;

public class MeasurementUtils {

    public static Integer convertFeetAndInchestoCm( Number feet, Number inches ){
        double height = feet.doubleValue() * 30.48 + inches.doubleValue() * 2.54 ;
        return Integer.valueOf((int)height);
    }

    public static Integer convertPoundsToKilos( Number n ){
        double weight = n.doubleValue() * 0.453592 ;
        return Integer.valueOf((int)weight);
    }
}
