# CalculatorApp

A simple JavaFX calculator application built with Java 21 and JavaFX 21.

## Build

Compile the application and output the classes into `bin`:

```bash
javac -d bin --module-path "\path\to\javafx-sdk\lib" --add-modules javafx.controls,javafx.fxml Launcher.java
```

## Package

Create the executable JAR and package the application:

```bash
# To copy css file to bin folder
cp ui/calculator.css bin/ui/
# To create the jar file
jar cfe input/CalculatorApp.jar Launcher -C bin .
# To check what is in the jar file
jar tf input/CalculatorApp.jar
```

## Create a Debian Package

Package the application as a `.deb` installer using `jpackage`:

```bash
jpackage --type deb \
  --name "CalculatorApp" \
  --app-version "1.0.0" \
  --vendor "SamKyataka" \
  --icon "path\to\app.png" \
  --input input \
  --main-jar CalculatorApp.jar \
  --main-class Launcher \
  --module-path "path\to\javafx-jmods" \
  --add-modules javafx.controls,javafx.fxml
```

## Create a Windows Installer
To create a Windows installer (.msi or .exe), you must run this command on a Windows machine. *Note: You must have WiX Toolset v3 installed and added to your PATH to generate these files.*

```bash
jpackage --type msi \
  --name "CalculatorApp" \
  --app-version "1.0.0" \
  --vendor "SamKyataka" \
  --icon "path\to\app.ico" \
  --input input \
  --main-jar CalculatorApp.jar \
  --main-class Launcher \
  --module-path "path\to\javafx-jmods" \
  --add-modules javafx.controls,javafx.fxml \
  --win-shortcut \
  --win-menu
```

## Create a macOS Bundle
To create a macOS installer (.dmg or .pkg), you must run this command on a macOS machine.

```bash
jpackage --type dmg \
  --name "CalculatorApp" \
  --app-version "1.0.0" \
  --vendor "SamKyataka" \
  --icon "path/to/app.icns" \
  --input input \
  --main-jar CalculatorApp.jar \
  --main-class Launcher \
  --module-path "path/to/javafx-jmods" \
  --add-modules javafx.controls,javafx.fxml
```

