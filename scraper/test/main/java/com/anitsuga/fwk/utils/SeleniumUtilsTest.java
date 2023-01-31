package com.anitsuga.fwk.utils;

import org.testng.Assert;
import org.testng.annotations.Test;

public class SeleniumUtilsTest {

    @Test
    public void testGetScreenshotFileName(){
        String filename = SeleniumUtils.getScreenshotFilename(1234);
        Assert.assertEquals(filename,"output/robot-1234.jpg");
    }

    @Test
    public void testIsScreenshotEnabled(){
        boolean ret = SeleniumUtils.isScreenshotEnabled();
        Assert.assertEquals(ret,true);
    }
}
