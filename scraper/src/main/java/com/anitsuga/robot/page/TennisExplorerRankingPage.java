package com.anitsuga.robot.page;

import com.anitsuga.fwk.page.Page;
import com.anitsuga.fwk.utils.AppProperties;
import com.anitsuga.robot.model.RankedPlayer;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

/**
 * TennisExporerRankingPage
 * @author agustina.dagnino
 */
public class TennisExplorerRankingPage extends Page {

    /**
     * logger
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(TennisExplorerRankingPage.class.getName());
    //*[@id="center"]/div[4]/div/div/table/tbody/tr[1]/td[3]/a
    @FindBy(xpath = "//*[@id=\"center\"]//*[@class=\"t-name\"]/a")
    private List<WebElement> players;

    /**
     * Default constructor
     *
     * @param driver
     */
    public TennisExplorerRankingPage(WebDriver driver) {
        super(driver);
    }

    /**
     * go
     * @param url
     * @return
     */
    public TennisExplorerRankingPage go(String url) {
        // go to url
        driver.get(url);

        // return page
        return new TennisExplorerRankingPage(this.driver);
    }

    /**
     * getRankedPlayers
     * @return
     */
    public List<RankedPlayer> getRankedPlayers( String league ){
        List<RankedPlayer> ret = new ArrayList<RankedPlayer>();
        int count = 0;
        int max = AppProperties.getInstance().intValue("max.ranking");
        for (WebElement player : players) {
            RankedPlayer ranking = new RankedPlayer();
            ranking.setLeague( league );
            ranking.setName( player.getText() );
            ranking.setSource( player.getAttribute("href") );
            ret.add(ranking);
            if( ++count>=max ) break;
        }
        return ret;
    }
}
