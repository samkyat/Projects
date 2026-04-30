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
      
      primaryStage.setTitle("Calculator");
      primaryStage.setScene(new Scene(builder.build(), 250, 300));
      primaryStage.show();
   }
}