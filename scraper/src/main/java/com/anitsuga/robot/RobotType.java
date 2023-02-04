package com.anitsuga.robot;

import com.anitsuga.fwk.utils.AppProperties;
import com.anitsuga.robot.types.*;
import com.anitsuga.robot.writer.*;

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
            Writer jsonWriter = new PlayerJsonWriter(localPath);
            return Arrays.asList(jsonWriter);
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
            Writer jsonWriter = new PlayerJsonWriter(localPath);
            Writer excelWriter = new PlayerExcelWriter(localPath+"/atp/");
            return Arrays.asList(jsonWriter,excelWriter);
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
            Writer jsonWriter = new PlayerJsonWriter(localPath);
            Writer excelWriter = new PlayerExcelWriter(localPath+"/wta/");
            return Arrays.asList(jsonWriter,excelWriter);
        }

        @Override
        public RobotURLProvider getURLProviders() {
            return new RankedPlayerURLProvider("");
        }

    },
    WTA_TENNIS_EXPLORER_RANKING_SCRAPER {

        @Override
        public String getContentTypeName() { return "ranking"; }

        @Override
        public Robot getInstance( Object... parameters ) { return new TennisExplorerRankingRobot(this, parameters); }

        @Override
        public List<Writer> getWriters() {
            return Arrays.asList();
        }

        @Override
        public RobotURLProvider getURLProviders() {
            AppProperties config = AppProperties.getInstance();
            String url = config.getProperty("tennisExplorer.wta.url");
            return new SameURLProvider(url);
        }
    },
    WTA_TENNIS_EXPLORER_PLAYERS_SCRAPER {

        @Override
        public String getContentTypeName() { return "stats"; }

        @Override
        public Robot getInstance( Object... parameters ) { return new TennisExplorerPlayerRobot(this, parameters ); }

        @Override
        public List<Writer> getWriters() {
            AppProperties config = AppProperties.getInstance();
            String localPath = config.getProperty("local.path");
            Writer excelWriter = new StatsExcelWriter(localPath+"/"+config.getProperty("wta.league")+"/");
            return Arrays.asList(excelWriter);
        }

        @Override
        public RobotURLProvider getURLProviders() {
            return new RankedPlayerURLProvider("");
        }

    },
    ATP_TENNIS_EXPLORER_RANKING_SCRAPER {

        @Override
        public String getContentTypeName() { return "ranking"; }

        @Override
        public Robot getInstance( Object... parameters ) { return new TennisExplorerRankingRobot(this, parameters); }

        @Override
        public List<Writer> getWriters() {
            return Arrays.asList();
        }

        @Override
        public RobotURLProvider getURLProviders() {
            AppProperties config = AppProperties.getInstance();
            String url = config.getProperty("tennisExplorer.atp.url");
            return new SameURLProvider(url);
        }
    },
    ATP_TENNIS_EXPLORER_PLAYERS_SCRAPER {

        @Override
        public String getContentTypeName() { return "stats"; }

        @Override
        public Robot getInstance( Object... parameters ) { return new TennisExplorerPlayerRobot(this, parameters ); }

        @Override
        public List<Writer> getWriters() {
            AppProperties config = AppProperties.getInstance();
            String localPath = config.getProperty("local.path");
            Writer excelWriter = new StatsExcelWriter(localPath+"/"+config.getProperty("atp.league")+"/");
            return Arrays.asList(excelWriter);
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
