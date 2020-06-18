import org.openqa.selenium.By;
import org.openqa.selenium.Point;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.remote.DesiredCapabilities;
import java.util.List;

public class selenium {
    public static void main(String[] args) throws InterruptedException {


        System.setProperty("webdriver.gecko.driver", "C:/geckodriver.exe");
//Now you can Initialize marionette driver to launch firefox
        DesiredCapabilities capabilities = DesiredCapabilities.firefox();
        capabilities.setCapability("marionette", true);
        WebDriver driver = new FirefoxDriver();
        driver.get("http://localhost:4200/login");
        WebElement element=driver.findElement(By.xpath("//input[@name='email']"));
        WebElement element1=driver.findElement(By.xpath("//input[@name='password']"));
        element.sendKeys("admin@mail.com");
        element1.sendKeys("admin");

              driver.findElement(By.cssSelector(".btn")).click();

        Thread.sleep(1000);
        driver.get("http://localhost:4200/corridors");
        Thread.sleep(4000);
        driver.findElement(By.cssSelector(".btn.btn-primary.btn-sm")).click();

            WebElement elementX0= driver.findElement(By.id("0x"));
            WebElement elementY0= driver.findElement(By.id("0y"));
            elementX0.clear();
            elementY0.clear();
            elementX0.sendKeys("3.06");
            elementY0.sendKeys("-2.51");
        //driver.findElement(By.xpath("//button[contains(.,'Zastosuj')]")).click();

        WebElement elementX1= driver.findElement(By.id("1x"));
        WebElement elementY1= driver.findElement(By.id("1y"));
        elementX1.clear();
        elementY1.clear();
        elementX1.sendKeys("3.07");
        elementY1.sendKeys("-1.63");
        //driver.findElement(By.xpath("//button[contains(.,'Zastosuj')]")).click();
        WebElement elementX2= driver.findElement(By.id("2x"));
        WebElement elementY2= driver.findElement(By.id("2y"));
        elementX2.clear();
        elementY2.clear();
        elementX2.sendKeys("1.50");
        elementY2.sendKeys("-1.62");
        //driver.findElement(By.xpath("//button[contains(.,'Zastosuj')]")).click();
        WebElement elementX3= driver.findElement(By.id("3x"));
        WebElement elementY3= driver.findElement(By.id("3y"));
        elementX3.clear();
        elementY3.clear();
        elementX3.sendKeys("1.50");
        elementY3.sendKeys("-1.38");

        WebElement elementX4= driver.findElement(By.id("4x"));
        WebElement elementY4= driver.findElement(By.id("4y"));
        elementX4.clear();
        elementY4.clear();
        elementX4.sendKeys("3.07");
        elementY4.sendKeys("-1.39");

        WebElement elementX5= driver.findElement(By.id("5x"));
        WebElement elementY5= driver.findElement(By.id("5y"));
        elementX5.clear();
        elementY5.clear();
        elementX5.sendKeys("3.09");
        elementY5.sendKeys("-0.46");

        WebElement elementX6= driver.findElement(By.id("6x"));
        WebElement elementY6= driver.findElement(By.id("6y"));
        elementX6.clear();
        elementY6.clear();
        elementX6.sendKeys("0.29");
        elementY6.sendKeys("-0.45");

        WebElement elementX7= driver.findElement(By.id("7x"));
        WebElement elementY7= driver.findElement(By.id("7y"));
        elementX7.clear();
        elementY7.clear();
        elementX7.sendKeys("0.26");
        elementY7.sendKeys("-2.49");
        //driver.findElement(By.xpath("//button[contains(.,'Zastosuj')]")).click();
        List<WebElement> li = driver.findElements(By.xpath("//button[contains(.,'Zastosuj')]"));
        for(int i=0;i<li.size();i++){
            li.get(i).click();
        }
        Thread.sleep(5000);
        driver.get("http://localhost:4200/polygons");
        Thread.sleep(4000);



        //List <WebElement> elements = (List<WebElement>) driver.findElement(By.xpath("//button[contains(.,'Zastosuj')]"));
       // }
        //WebElement element3= driver.findElement(By.id("0x"));
        //element3.sendKeys("66");
       /* WebElement ele= driver.findElement(By.id("map"));
        Point point = ele.getLocation();
        int xcord = point.getX();
        int ycord = point.getY();
        Actions act = new Actions(driver);
        act.moveByOffset(800, 500).click().build().perform();
        act.moveByOffset(1, 1).click().build().perform();
        for( int i=0; i < 1000; i++)
        {
            act.moveByOffset(1, 1).click().build().perform();
            Thread.sleep(400);
        }*/

        driver.findElement(By.cssSelector(".btn.btn-primary.btn-sm")).click();

        WebElement polygonX0= driver.findElement(By.id("0x"));
        WebElement polygonY0= driver.findElement(By.id("0y"));
        polygonX0.clear();
        polygonY0.clear();
        polygonX0.sendKeys("3.06");
        polygonY0.sendKeys("-2.51");
        //driver.findElement(By.xpath("//button[contains(.,'Zastosuj')]")).click();

        WebElement polygonX1= driver.findElement(By.id("1x"));
        WebElement polygonY1= driver.findElement(By.id("1y"));
        polygonX1.clear();
        polygonY1.clear();
        polygonX1.sendKeys("3.07");
        polygonY1.sendKeys("-1.63");
        //driver.findElement(By.xpath("//button[contains(.,'Zastosuj')]")).click();
        WebElement polygonX2= driver.findElement(By.id("2x"));
        WebElement polygonY2= driver.findElement(By.id("2y"));
        polygonX2.clear();
        polygonY2.clear();
        polygonX2.sendKeys("1.50");
        polygonY2.sendKeys("-1.62");
        //driver.findElement(By.xpath("//button[contains(.,'Zastosuj')]")).click();
        WebElement polygonX3= driver.findElement(By.id("3x"));
        WebElement polygonY3= driver.findElement(By.id("3y"));
        polygonX3.clear();
        polygonY3.clear();
        polygonX3.sendKeys("1.50");
        polygonY3.sendKeys("-1.38");

        WebElement polygonX4= driver.findElement(By.id("4x"));
        WebElement polygonY4= driver.findElement(By.id("4y"));
        polygonX4.clear();
        polygonY4.clear();
        polygonX4.sendKeys("3.07");
        polygonY4.sendKeys("-1.39");

        WebElement polygonX5= driver.findElement(By.id("5x"));
        WebElement polygonY5= driver.findElement(By.id("5y"));
        polygonX5.clear();
        polygonY5.clear();
        polygonX5.sendKeys("3.09");
        polygonY5.sendKeys("-0.46");

        WebElement polygonX6= driver.findElement(By.id("6x"));
        WebElement polygonY6= driver.findElement(By.id("6y"));
        polygonX6.clear();
        polygonY6.clear();
        polygonX6.sendKeys("0.29");
        polygonY6.sendKeys("-0.45");

        WebElement polygonX7= driver.findElement(By.id("7x"));
        WebElement polygonY7= driver.findElement(By.id("7y"));
        polygonX7.clear();
        polygonY7.clear();
        polygonX7.sendKeys("0.26");
        polygonY7.sendKeys("-2.49");
        //driver.findElement(By.xpath("//button[contains(.,'Zastosuj')]")).click();
        List<WebElement> liy = driver.findElements(By.xpath("//button[contains(.,'Zastosuj')]"));
        for(int i=0;i<liy.size();i++){
            liy.get(i).click();
        }

        Thread.sleep(5000);
        driver.get("http://localhost:4200/graphcreator");
        Thread.sleep(4000);


        driver.findElement(By.cssSelector(".btn.btn-primary.btn-sm")).click();

        WebElement graphX0= driver.findElement(By.id("0x"));
        WebElement graphY0= driver.findElement(By.id("0y"));
        graphX0.clear();
        graphY0.clear();
        graphX0.sendKeys("2.80");
        graphY0.sendKeys("2.37");
        //driver.findElement(By.xpath("//button[contains(.,'Zastosuj')]")).click();

        WebElement graphX1= driver.findElement(By.id("1x"));
        WebElement graphY1= driver.findElement(By.id("1y"));
        graphX1.clear();
        graphY1.clear();
        graphX1.sendKeys("2.83");
        graphY1.sendKeys("0.24");
        //driver.findElement(By.xpath("//button[contains(.,'Zastosuj')]")).click();
        WebElement graphX2= driver.findElement(By.id("2x"));
        WebElement graphY2= driver.findElement(By.id("2y"));
        graphX2.clear();
        graphY2.clear();
        graphX2.sendKeys("0.64");
        graphY2.sendKeys("0.22");
        //driver.findElement(By.xpath("//button[contains(.,'Zastosuj')]")).click();
        WebElement graphX3= driver.findElement(By.id("3x"));
        WebElement graphY3= driver.findElement(By.id("3y"));
        graphX3.clear();
        graphY3.clear();
        graphX3.sendKeys("0.67");
        graphY3.sendKeys("-1.12");

        WebElement graphX4= driver.findElement(By.id("4x"));
        WebElement graphY4= driver.findElement(By.id("4y"));
        graphX4.clear();
        graphY4.clear();
        graphX4.sendKeys("2.81");
        graphY4.sendKeys("-1.10");

        WebElement graphX5= driver.findElement(By.id("5x"));
        WebElement graphY5= driver.findElement(By.id("5y"));
        graphX5.clear();
        graphY5.clear();
        graphX5.sendKeys("0.69");
        graphY5.sendKeys("-2.10");

        WebElement graphX6= driver.findElement(By.id("6x"));
        WebElement graphY6= driver.findElement(By.id("6y"));
        graphX6.clear();
        graphY6.clear();
        graphX6.sendKeys("2.53");
        graphY6.sendKeys("-2.08");

        WebElement graphX7= driver.findElement(By.id("7x"));
        WebElement graphY7= driver.findElement(By.id("7y"));
        graphX7.clear();
        graphY7.clear();
        graphX7.sendKeys("0.83");
        graphY7.sendKeys("1.92");

        WebElement graphX8= driver.findElement(By.id("8x"));
        WebElement graphY8= driver.findElement(By.id("8y"));
        graphX8.clear();
        graphY8.clear();
        graphX8.sendKeys("0.84");
        graphY8.sendKeys("1.03");

        WebElement graphX9= driver.findElement(By.id("9x"));
        WebElement graphY9= driver.findElement(By.id("9y"));
        graphX9.clear();
        graphY9.clear();
        graphX9.sendKeys("-0.51");
        graphY9.sendKeys("1.04");

        WebElement graphX10= driver.findElement(By.id("10x"));
        WebElement graphY10= driver.findElement(By.id("10y"));
        graphX10.clear();
        graphY10.clear();
        graphX10.sendKeys("-0.52");
        graphY10.sendKeys("2.48");

        WebElement graphX11= driver.findElement(By.id("11x"));
        WebElement graphY11= driver.findElement(By.id("11y"));
        graphX11.clear();
        graphY11.clear();
        graphX11.sendKeys("-1.26");
        graphY11.sendKeys("1.96");

        WebElement graphX12= driver.findElement(By.id("12x"));
        WebElement graphY12= driver.findElement(By.id("12y"));
        graphX12.clear();
        graphY12.clear();
        graphX12.sendKeys("-1.25");
        graphY12.sendKeys("0.79");

        WebElement graphX13= driver.findElement(By.id("13x"));
        WebElement graphY13= driver.findElement(By.id("13y"));
        graphX13.clear();
        graphY13.clear();
        graphX13.sendKeys("-1.24");
        graphY13.sendKeys("0.15");

        WebElement graphX14= driver.findElement(By.id("14x"));
        WebElement graphY14= driver.findElement(By.id("14y"));
        graphX14.clear();
        graphY14.clear();
        graphX14.sendKeys("-0.66");
        graphY14.sendKeys("-0.15");

        WebElement graphX15= driver.findElement(By.id("15x"));
        WebElement graphY15= driver.findElement(By.id("15y"));
        graphX15.clear();
        graphY15.clear();
        graphX15.sendKeys("-0.98");
        graphY15.sendKeys("-1.80");





        //driver.findElement(By.xpath("//button[contains(.,'Zastosuj')]")).click();
        List<WebElement> liyg = driver.findElements(By.xpath("//button[contains(.,'Zastosuj')]"));
        for(int i=0;i<liyg.size();i++){
            liyg.get(i).click();
        }


    }
}
