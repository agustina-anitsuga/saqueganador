package com.anitsuga.robot.types;

import com.anitsuga.robot.RobotURLProvider;
import org.openqa.selenium.WebDriver;

import java.util.Collections;
import java.util.List;

/**
 * SameURLProvider
 * @author agustina.dagnino
 */
public class SameURLProvider implements RobotURLProvider {

    private String url;

    /**
     * SameURLProvider
     * @param url
     */
    public SameURLProvider( String url ){
        this.url = url;
    }

    /**
     * getURLs
     * @return
     */
    @Override
    public List<String> getURLs() {
        return Collections.singletonList(this.url);
    }

    /**
     * setParameters
     * @param parameters
     */
    @Override
    public void setParameters(Object parameters) {

    }
}
