package com.anitsuga.robot.types;

import com.anitsuga.fwk.utils.AppProperties;
import com.anitsuga.robot.RobotURLProvider;

import java.util.Collections;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

/**
 * TennisExplorerURLProvider
 * @author agustina.dagnino
 */
public class TennisExplorerURLProvider implements RobotURLProvider {

    private String url;

    /**
     * SameURLProvider
     * @param url
     */
    public TennisExplorerURLProvider(String url ){
        this.url = url;
    }

    /**
     * getURLs
     * @return
     */
    @Override
    public List<String> getURLs() {
        int max = AppProperties.getInstance().intValue("tennisExplorer.maxPage");
        Function<Integer,String> func = x -> url + "?page=" + x;
        return  IntStream.range(1, max + 1).boxed().map( func ).collect(Collectors.toList());
    }

    /**
     * setParameters
     * @param parameters
     */
    @Override
    public void setParameters(Object parameters) {

    }

}
