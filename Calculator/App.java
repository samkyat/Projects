import domain.Calculator;
import ui.ViewModel;
import ui.ViewBuilder;
import javafx.application.Application;
import javafx.stage.Stage;
import javafx.scene.Scene;

/**
 This is a javaFX calculator with an interface.
 @author Sam Kyataka
*/
public class App extends Application {
   public static void main(String[] args){
      launch(args);
   }

   public void start(Stage primaryStage){
      
      ViewModel model = new ViewModel(new Calculator());
      ViewBuilder builder = new ViewBuilder(model);
      
      Scene scene = new Scene(builder.build(), 300, 450);
      try {
         String css = this.getClass().getResource("/ui/calculator.css").toExternalForm();
         scene.getStylesheets().add(css);
      } catch (NullPointerException e) {
         System.err.println("CSS file not found: /ui/calculator.css");
      }
      
      primaryStage.setTitle("Calculator");
      primaryStage.setScene(scene);
      primaryStage.setResizable(false);
      primaryStage.show();
   }
}
