package com.anitsuga.robot.types;

import com.anitsuga.fwk.page.Page;
import com.anitsuga.fwk.utils.AppProperties;
import com.anitsuga.robot.AbstractRobot;
import com.anitsuga.robot.RobotType;
import com.anitsuga.robot.model.Content;
import com.anitsuga.robot.model.Player;
import com.anitsuga.robot.model.RankedPlayer;
import com.anitsuga.robot.page.ATPPlayerPage;
import com.anitsuga.robot.page.EspnATPPlayerPage;
import org.openqa.selenium.WebDriver;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * EspnATPPlayerRobot
 * @author agustina.dagnino
 */
public class EspnATPPlayerRobot extends AbstractRobot {

    private Map<String,String> leagueProfileUrls;

    /**
     * EspnATPPlayerRobot
     * @param robotType
     * @param parameters
     */
    public EspnATPPlayerRobot(RobotType robotType, Object... parameters) {
        super(robotType,  (List<RankedPlayer>) parameters[0] );
        initializeLeagueProfileUrlMap( (List<RankedPlayer>) parameters[1] );
    }

    /**
     * initializeLeagueProfileUrlMap
     * @param players
     */
    private void initializeLeagueProfileUrlMap(List<RankedPlayer> players) {
        this.leagueProfileUrls = new HashMap<String,String>();
        for (RankedPlayer player: players) {
            this.leagueProfileUrls.put(player.getKey(),player.getSource());
        }
    }

    /**
     * goToContentPage
     * @param url
     * @param driver
     * @return
     */
    @Override
    protected Page goToContentPage(String url, WebDriver driver) {
        EspnATPPlayerPage page = new EspnATPPlayerPage(driver);
        return page.go(url);
    }

    /**
     * scrapeContent
     * @param url
     * @param driver
     * @param contentPage
     * @return
     */
    @Override
    protected Content scrapeContent(String url, WebDriver driver, Page contentPage) {
        EspnATPPlayerPage page = (EspnATPPlayerPage) contentPage;
        Player player = Player.builder()
                .fullName(page.getFullName())
                .firstName(page.getFirstName())
                .lastName(page.getLastName())
                .birthDate(page.getBirthDate())
                .gameStyle(page.getGameStyle())
                .nationality(page.getNationality())
                .yearTurnedPro(page.getYearTurnedPro())
                .heightInCm(page.getHeightInCm())
                .weightInKilos(page.getWeightInKilos())
                .profilePicUrl(page.getProfilePicUrl())
                .league(AppProperties.getInstance().getProperty("atp.league"))
                .build();
        player.setLeagueProfileUrl(this.getLeagueProfileUrl(player));
        player.setSource(url);
        return player;
    }

    /**
     * getLeagueProfileUrl
     * @param player
     * @return
     */
    private String getLeagueProfileUrl(Player player) {
        return this.leagueProfileUrls.get(player.getKey());
    }

    /**
     * validConfig
     * @return
     */
    public boolean validConfig() {
        return super.validConfig() &&
                !AppProperties.getInstance().isPropertyEmpty("atp.url") &&
                !AppProperties.getInstance().isPropertyEmpty("atp.league") &&
                this.parameters != null;
    }

}
