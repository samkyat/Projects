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
        return null;
    }

    public Node displayLabel(){
        Label display = new Label();
        display.textProperty().bind(viewModel.getNumProperty());
        return display;
    }

    public Node row1(){
        HBox row = new HBox();
        return row;
    }
}