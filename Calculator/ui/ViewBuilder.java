package ui;

import javafx.geometry.Insets;
import javafx.scene.Node;
import javafx.scene.layout.Region;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.util.Builder;

public class ViewBuilder implements Builder<Region>{
    private String[][] symbols = {{"AC", "DEL", "%", "÷"},
                                  {"7", "8", "9", "x"},
                                  {"4", "5", "6", "-"},
                                  {"1", "2", "3", "+"},
                                  {"+/-", "0", ".", "="}};
    private ViewModel viewModel;
    public ViewBuilder(ViewModel viewMdl){
        viewModel = viewMdl;
    }

    public Region build(){
        VBox vbox = new VBox(displayLabel(), row1(), row2(), row3(), row4(), row5());
        vbox.setSpacing(5);
        vbox.setPadding(new Insets(10));
        return vbox;
    }

    public Node displayLabel(){
        Label display = new Label();
        display.textProperty().bind(viewModel.getNumProperty());
        return display;
    }

    public Node row1(){
        HBox row = new HBox();

        row.setPadding(new Insets(10));
        int len = symbols[0].length;
        for (int i = 0; i < len; i++){
            Button btn = new Button(symbols[0][i]);
            btn.setPrefWidth(50);
            btn.setOnAction(evt -> processReq(btn.getText()));
            row.getChildren().add(btn);
        }
        return row;
    }
    public Node row2(){
        HBox row = new HBox();
        row.setPadding(new Insets(10));
        int len = symbols[1].length;
        for (int i = 0; i < len; i++){
            Button btn = new Button(symbols[1][i]);
            btn.setPrefWidth(50);
            btn.setOnAction(evt -> processReq(btn.getText()));
            row.getChildren().add(btn);
        }
        return row;
    }
    public Node row3(){
        HBox row = new HBox();
        row.setPadding(new Insets(10));
        int len = symbols[2].length;
        for (int i = 0; i < len; i++){
            Button btn = new Button(symbols[2][i]);
            btn.setPrefWidth(50);
            btn.setOnAction(evt -> processReq(btn.getText()));
            row.getChildren().add(btn);
        }
        return row;
    }
    public Node row4(){
        HBox row = new HBox();

        row.setPadding(new Insets(10));
        int len = symbols[3].length;
        for (int i = 0; i < len; i++){
            Button btn = new Button(symbols[3][i]);
            btn.setPrefWidth(50);
            btn.setOnAction(evt -> processReq(btn.getText()));
            row.getChildren().add(btn);
        }
        return row;
    }
    public Node row5(){
        HBox row = new HBox();

        row.setPadding(new Insets(10));
        int len = symbols[4].length;
        for (int i = 0; i < len; i++){
            Button btn = new Button(symbols[4][i]);
            btn.setPrefWidth(50);
            btn.setOnAction(evt -> processReq(btn.getText()));
            row.getChildren().add(btn);
        }
        return row;
    }

    public void processReq(String symbl){
        if ("0123456789".contains(symbl)){
            viewModel.updateCurrNum(symbl);
        }
        else if ("+-x÷".contains(symbl)){
            if (viewModel.getOp()==null){
                viewModel.updateA();
                viewModel.getNumProperty().setValue("0");
                viewModel.updateB("0");
            }
            viewModel.updateOp(symbl);
            
        }
        else if (symbl.equals("=")){
            if (viewModel.getA()!=null){
                viewModel.updateB();
                viewModel.calculate();
                viewModel.allClear();
            }
        }
        else if (symbl.equals("%")){
            viewModel.updateA();
            viewModel.updateB("0");
            viewModel.updateOp(symbl);
            viewModel.calculate();
        }
        else if (symbl.equals("+/-")){
            viewModel.signChange();
        }
        else if (symbl.equals("AC")){
            viewModel.allClear();
            viewModel.getNumProperty().setValue("0");
        }
        else if (symbl.equals(".")){
            if (!viewModel.getNumProperty().getValue().contains(".")){
                viewModel.updateCurrNum(symbl);
            }
        }
        else if (symbl.equals("DEL")){
            viewModel.delete();
        }
    }
}