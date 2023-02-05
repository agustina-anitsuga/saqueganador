package com.anitsuga.robot;

import java.util.List;

/**
 * RobotURLProvider
 * @author agustina
 *
 */
public interface RobotURLProvider {

     /**
      * getURLs
      * @return
      */
     public List<String> getURLs();

     /**
      * setParameters
      * @param parameters
      */
     public void setParameters( Object parameters );

}
