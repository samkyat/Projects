import javafx.application.Application;
import javafx.stage.Stage;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.TextField;
import javafx.scene.text.Text;
import javafx.scene.text.Font;
import javafx.scene.layout.GridPane;
import javafx.geometry.Pos;
import javafx.geometry.HPos;
import javafx.event.ActionEvent;
import java.util.Scanner;

/**
 This is a javaFX calculator with an interface.
 @author Sam Kyataka
*/
public class App extends Application {
   public static void main(String[] args){
      launch(args);
   }

   public void start(Stage primaryStage){
      primaryStage.setTitle("Calculator");
      Text greeting = new Text("Welcome To My Calculator");
      GridPane grid = new GridPane();
      grid.add(greeting, 0,0,4,1);
      Scene scene = new Scene(grid, 250,300);
      primaryStage.setScene(scene);
      primaryStage.show();
   }
}