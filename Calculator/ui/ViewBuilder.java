package ui;

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
        vbox.setSpacing(10);
        vbox.getStyleClass().add("calculator-root");
        vbox.setPrefWidth(300);
        vbox.setPrefHeight(500);
        return vbox;
    }

    public Node displayLabel(){
        Label display = new Label("0");
        display.textProperty().bind(viewModel.getNumProperty());
        display.getStyleClass().add("calculator-display");
        return display;
    }

    private HBox createRow(int rowIndex) {
        HBox row = new HBox();
        row.setSpacing(10);
        row.getStyleClass().add("calculator-row");
        int len = symbols[rowIndex].length;
        for (int i = 0; i < len; i++){
            Button btn = new Button(symbols[rowIndex][i]);
            btn.setPrefWidth(60);
            btn.getStyleClass().add("calculator-button");
            applyButtonStyle(btn, symbols[rowIndex][i]);
            btn.setOnAction(evt -> processReq(btn.getText()));
            row.getChildren().add(btn);
        }
        return row;
    }

    private void applyButtonStyle(Button btn, String symbol) {
        if ("+-x÷".contains(symbol)) {
            btn.getStyleClass().add("operator-button");
        } else if (symbol.equals("=")) {
            btn.getStyleClass().add("equals-button");
        } else if (symbol.equals("+/-")) {
            btn.getStyleClass().add("special-button");
        } else if ("ACDEL%".contains(symbol)) {
            btn.getStyleClass().add("function-button");
        }
    }

    public Node row1() {
        return createRow(0);
    }

    public Node row2() {
        return createRow(1);
    }

    public Node row3() {
        return createRow(2);
    }

    public Node row4() {
        return createRow(3);
    }

    public Node row5() {
        return createRow(4);
    }

    public void processReq(String symbl){
        if ("0123456789".contains(symbl)){
            viewModel.updateCurrNum(symbl);
        }
        else if ("+-x÷".contains(symbl)){
            viewModel.handleOperator(symbl);
            
        }
        else if (symbl.equals("=")){
            if (viewModel.getA()!=null){
                viewModel.updateB();
                viewModel.calculate();
                viewModel.allClear();
            }
        }
        else if (symbl.equals("%")){
            viewModel.percentage();
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
