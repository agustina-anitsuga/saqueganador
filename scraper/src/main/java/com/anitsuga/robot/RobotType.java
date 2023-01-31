package com.anitsuga.robot;

import com.anitsuga.fwk.utils.AppProperties;
import com.anitsuga.robot.types.*;
import com.anitsuga.robot.writer.PlayerJsonWriter;
import com.anitsuga.robot.writer.RankingJsonWriter;
import com.anitsuga.robot.writer.Writer;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * RobotType
 * @author agustina.dagnino
 *
 */
public enum RobotType {

    ATP_RANKING_SCRAPER {

        @Override
        public String getContentTypeName() { return "ranking"; }

        @Override
        public Robot getInstance( Object... parameters ) { return new ATPRankingRobot(this, parameters ); }

        @Override
        public List<Writer> getWriters() {
            AppProperties config = AppProperties.getInstance();
            String localPath = config.getProperty("local.path");
            Writer writer = new RankingJsonWriter(
                    String.format("%s/%s/players.json",localPath,config.getProperty("atp.league")));
            return Arrays.asList(writer);
        }

        @Override
        public RobotURLProvider getURLProviders() {
            AppProperties config = AppProperties.getInstance();
            String url = config.getProperty("atp.url");
            return new SameURLProvider(url);
        }

    },
    ESPN_ATP_RANKING_SCRAPER {

        @Override
        public String getContentTypeName() { return "ranking"; }

        @Override
        public Robot getInstance( Object... parameters ) { return new EspnATPRankingRobot(this, parameters ); }

        @Override
        public List<Writer> getWriters() {
            return new ArrayList();
        }

        @Override
        public RobotURLProvider getURLProviders() {
            AppProperties config = AppProperties.getInstance();
            String url = config.getProperty("espn.url");
            return new SameURLProvider(url);
        }

    },
    ATP_PLAYERS_SCRAPER {

        @Override
        public String getContentTypeName() { return "player"; }

        @Override
        public Robot getInstance( Object... parameters ) { return new ATPPlayerRobot(this, parameters ); }

        @Override
        public List<Writer> getWriters() {
            AppProperties config = AppProperties.getInstance();
            String localPath = config.getProperty("local.path");
            Writer writer = new PlayerJsonWriter(localPath);
            return Arrays.asList(writer);
        }

        @Override
        public RobotURLProvider getURLProviders() {
            return new RankedPlayerURLProvider("");
        }

    },
    ESPN_ATP_PLAYERS_SCRAPER {

        @Override
        public String getContentTypeName() { return "player"; }

        @Override
        public Robot getInstance( Object... parameters ) { return new EspnATPPlayerRobot(this, parameters ); }

        @Override
        public List<Writer> getWriters() {
            AppProperties config = AppProperties.getInstance();
            String localPath = config.getProperty("local.path");
            Writer writer = new PlayerJsonWriter(localPath);
            return Arrays.asList(writer);
        }

        @Override
        public RobotURLProvider getURLProviders() {
            return new RankedPlayerURLProvider("");
        }

    },
    WTA_RANKING_SCRAPER {

        @Override
        public String getContentTypeName() { return "ranking"; }

        @Override
        public Robot getInstance( Object... parameters ) { return new WTARankingRobot(this, parameters ); }

        @Override
        public List<Writer> getWriters() {
            AppProperties config = AppProperties.getInstance();
            String localPath = config.getProperty("local.path");
            Writer writer = new RankingJsonWriter(
                    String.format("%s/%s/players.json",localPath,config.getProperty("wta.league")));
            return Arrays.asList(writer);
        }

        @Override
        public RobotURLProvider getURLProviders() {
            AppProperties config = AppProperties.getInstance();
            String url = config.getProperty("wta.url");
            return new SameURLProvider(url);
        }
    },
    WTA_PLAYERS_SCRAPER {

        @Override
        public String getContentTypeName() { return "player"; }

        @Override
        public Robot getInstance( Object... parameters ) { return new WTAPlayerRobot(this, parameters ); }

        @Override
        public List<Writer> getWriters() {
            AppProperties config = AppProperties.getInstance();
            String localPath = config.getProperty("local.path");
            Writer writer = new PlayerJsonWriter(localPath);
            return Arrays.asList(writer);
        }

        @Override
        public RobotURLProvider getURLProviders() {
            return new RankedPlayerURLProvider("");
        }

    };

    public abstract String getContentTypeName();
    public abstract Robot getInstance( Object... parameters );
    public abstract List<Writer> getWriters();
    public abstract RobotURLProvider getURLProviders();

}
