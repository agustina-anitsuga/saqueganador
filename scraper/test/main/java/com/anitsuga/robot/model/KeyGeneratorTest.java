package com.anitsuga.robot.model;

import org.testng.Assert;
import org.testng.annotations.Test;

public class KeyGeneratorTest {

    @Test
    public void testGenerateKeyFromFullName(){
        String key = KeyGenerator.getPlayerKey("wta", "Iga Swiatek");
        Assert.assertEquals(key,"wta/players/iga-swiatek");
    }

    @Test
    public void testGenerateKeyFromFirstAndLastNames(){
        String key = KeyGenerator.getPlayerKey("wta", "Iga", "Swiatek");
        Assert.assertEquals(key,"wta/players/iga-swiatek");
    }
}
