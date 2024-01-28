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
public class Calculator extends Application {
   String output = "";
   String operation = "";
   String display = "";
   double num1 = 0.0;
   double num2 = 0.0;
   
   TextField input;
   Text greeting;
   Button clrBt;
   Button oneBt;
   Button twoBt;
   Button threeBt;
   Button fourBt;
   Button fiveBt;
   Button sixBt;
   Button sevenBt;
   Button eightBt;
   Button nineBt;
   Button zeroBt;
   Button pointBt;
   Button plusBt;
   Button minusBt;
   Button multBt;
   Button divBt;
   Button ansBt;
   
   public void start(Stage primaryStage){
      primaryStage.setTitle("Calculator");
      
      greeting = new Text("Welcome To My Calculator");
      
      input = new TextField("");
      input.setAlignment(Pos.BASELINE_RIGHT);
      
      clrBt = new Button ("Clear");
      clrBt.setPrefWidth(50);
      clrBt.setOnAction(this::controlRequest);
      
      oneBt = new Button ("1");
      oneBt.setPrefWidth(50);
      oneBt.setOnAction(this::numButtonRequest);
      
      twoBt = new Button ("2");
      twoBt.setPrefWidth(50);
      twoBt.setOnAction(this::numButtonRequest);
      
      threeBt = new Button("3");
      threeBt.setPrefWidth(50);
      threeBt.setOnAction(this::numButtonRequest);
      
      fourBt = new Button ("4");
      fourBt.setPrefWidth(50);
      fourBt.setOnAction(this::numButtonRequest);
      
      fiveBt = new Button ("5");
      fiveBt.setPrefWidth(50);
      fiveBt.setOnAction(this::numButtonRequest);
      
      sixBt = new Button ("6");
      sixBt.setPrefWidth(50);
      sixBt.setOnAction(this::numButtonRequest);
      
      sevenBt = new Button ("7");
      sevenBt.setPrefWidth(50);
      sevenBt.setOnAction(this::numButtonRequest);
      
      eightBt = new Button ("8");
      eightBt.setPrefWidth(50);
      eightBt.setOnAction(this::numButtonRequest);
      
      nineBt = new Button ("9");
      nineBt.setPrefWidth(50);
      nineBt.setOnAction(this::numButtonRequest);
      
      zeroBt = new Button ("0");
      zeroBt.setPrefWidth(50);
      zeroBt.setOnAction(this::numButtonRequest);
      
      pointBt = new Button (".");
      pointBt.setPrefWidth(50);
      pointBt.setOnAction(this::numButtonRequest);
      
      plusBt = new Button ("+");
      plusBt.setPrefWidth(50);
      plusBt.setOnAction(this::controlRequest);
      
      minusBt = new Button ("-");
      minusBt.setPrefWidth(50);
      minusBt.setOnAction(this::controlRequest);
      
      multBt = new Button ("x");
      multBt.setPrefWidth(50);
      multBt.setOnAction(this::controlRequest);
      
      divBt = new Button ("\u00F7");
      divBt.setPrefWidth(50);
      divBt.setOnAction(this::controlRequest);
      
      ansBt = new Button ("=");
      ansBt.setPrefWidth(50);
      ansBt.setOnAction(this::controlRequest);
      
      
      
      GridPane grid = new GridPane();
      grid.setAlignment(Pos.CENTER);
      grid.setHgap(10);
      grid.setVgap(10);
      
      grid.add(greeting, 0,0,4,1);
      GridPane.setHalignment(greeting, HPos.CENTER);
      
      grid.add(input, 0,1,3,1);
      grid.add(clrBt, 3,1);
      grid.add(sevenBt, 0,2);
      grid.add(eightBt, 1,2);
      grid.add(nineBt, 2,2);
      grid.add(plusBt, 3,2);
      grid.add(fourBt, 0,3);
      grid.add(fiveBt, 1,3);
      grid.add(sixBt, 2,3);
      grid.add(minusBt, 3,3);
      grid.add(oneBt, 0,4);
      grid.add(twoBt, 1,4);
      grid.add(threeBt, 2,4);
      grid.add(multBt, 3,4);
      grid.add(zeroBt, 0,5);
      grid.add(pointBt, 1,5);
      grid.add(ansBt, 2,5);
      grid.add(divBt, 3,5);
      
      Scene scene = new Scene(grid, 250,300);
      primaryStage.setScene(scene);
      primaryStage.show();
   }
   
   public void numButtonRequest(ActionEvent event){//The number buttons of the calculator
      
      if (event.getSource() == zeroBt){
         
         output += "0";
         
         if (operation.equals("=")){
            display = output;
         }
         else {
            display += "0";
         }
      }      
      else if (event.getSource() == oneBt){
         
         output += "1";
         
         if (operation.equals("=")){
            display = output;
         }
         else {
            display += "1";
         }
      }
      else if (event.getSource() == twoBt){
         
         output += "2";
         
         if (operation.equals("=")){
            display = output;
         }
         else {
            display += "2";
         }
      }
      else if (event.getSource() == threeBt){
         
         output += "3";
         
         if (operation.equals("=")){
            display = output;
         }
         else {
            display += "3";
         }
      }
      else if (event.getSource() == fourBt){
        
         output += "4";
         
         if (operation.equals("=")){
            display = output;
         }
         else {
            display += "4";
         }
      }
      else if (event.getSource() == fiveBt){
         
         output += "5";
         if (operation.equals("=")){
            display = output;
         }
         else {
            display += "5";
         }
      }
      else if (event.getSource() == sixBt){
         
         output += "6";
         
         if (operation.equals("=")){
            display = output;
         }
         else {
            display += "6";
         }
      }
      else if (event.getSource() == sevenBt){
         
         output += "7";
         
         if (operation.equals("=")){
            display = output;
         }
         else {
            display += "7";
         }
      }
      else if (event.getSource() == eightBt){
         
         output += "8";
         
         if (operation.equals("=")){
            display = output;
         }
         else {
            display += "8";
         }
      }
      else if (event.getSource() == nineBt){
         
         output += "9";
         
         if (operation.equals("=")){
            display = output;
         }
         else {
            display += "9";
         }
      }
      else if (event.getSource() == pointBt){
         if (input.getText() == ""){
            output = "0.";
            display += "0.";
         }
         else{
            int counter = 0;
            String ch = input.getText();
            for (int i = 0; i<ch.length(); i++){
               if (ch.charAt(i) == '.'){
                  counter++;
               }
            }
           
            if (counter < 1){
              output += ".";
              display += ".";
            }
         }
      }
      
      input.setText(output);
      greeting.setText(display);
   }
   
   public void controlRequest(ActionEvent event){//The operations and controls of the calculator
      
      if (event.getSource() == plusBt){
         
         num1 = Double.parseDouble(input.getText());
         output = "";
         operation = "+";
         display = num1 + " + ";
      }
      else if (event.getSource() == minusBt){
         
         num1 = Double.parseDouble(input.getText());
         output = "";
         operation = "-";
         display = num1 + " - ";
      }
      else if (event.getSource() == multBt){
         num1 = Double.parseDouble(input.getText());
         output = "";
         operation = "x";
         display = num1 + " x ";
      }
      else if (event.getSource() == divBt){
      
         num1 = Double.parseDouble(input.getText());
         output = "";
         operation = "\u00F7";
         display = num1 + " \u00F7 ";
      }
      else if (event.getSource() == clrBt){
         output = "";
         num1 = 0;
         num2 = 0;
         display = "";
      }
      
      if (event.getSource() == ansBt){
         double answer = 0;
         num2 = Double.parseDouble(input.getText());
         
         display = num1 + " " +  operation + " " + num2 + " =";
         
         switch (operation){
            case "+":
               answer = num1 + num2;
               break;
            case "-":
               answer = num1 - num2;
               break;
            case "x":
               answer = num1*num2;
               break;
            case "\u00F7":
               answer = num1/num2;
               break;
         }
         
         output = "" + answer;
         operation = "=";
      }
      
      greeting.setText(display);
      input.setText(output);
   }
}
