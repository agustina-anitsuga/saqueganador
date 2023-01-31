package com.anitsuga.fwk.utils;

import org.testng.Assert;
import org.testng.annotations.Test;

public class AppPropertiesTest {

    @Test
    public void testGetProperty(){
        String prop1 = AppProperties.getInstance().getProperty("aNonExistentProperty");
        Assert.assertNull(prop1);

        String prop2 = AppProperties.getInstance().getProperty("existentProperty");
        Assert.assertEquals(prop2,"hello world");
    }

    @Test(expectedExceptions = Exception.class)
    public void testDoubleValueError() {
        AppProperties.getInstance().doubleValue("notADouble");
    }

    @Test
    public void testDoubleValue(){
        double prop = AppProperties.getInstance().doubleValue("actualDouble");
        Assert.assertEquals(prop,0.1234);
    }

    @Test
    public void testBooleanValue(){
        boolean prop1 = AppProperties.getInstance().booleanValue("actualBoolean", false);
        Assert.assertEquals(prop1,true);

        boolean prop2 = AppProperties.getInstance().booleanValue("actualBooleanNonExistentProp", false);
        Assert.assertEquals(prop2,false);

        boolean prop3 = AppProperties.getInstance().booleanValue("notABoolean", false);
        Assert.assertEquals(prop2,false);
    }

    @Test
    public void testIsPropertyEmpty(){
        boolean prop1 = AppProperties.getInstance().isPropertyEmpty("emptyProperty");
        Assert.assertEquals(prop1,true);

        boolean prop2 = AppProperties.getInstance().isPropertyEmpty("nonEmptyProperty");
        Assert.assertEquals(prop2,false);
    }
}
