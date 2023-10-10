import java.io.*;
import java.net.*;
import java.util.Scanner;

public class CalculatorClient {
    private static final String SERVER_ADDRESS = "localhost";
    private static final int SERVER_PORT = 5000;

    public static void main(String[] args) {
        try (Socket socket = new Socket(SERVER_ADDRESS, SERVER_PORT);
             BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
             PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
             Scanner scanner = new Scanner(System.in)) {

            System.out.println("Connected to the calculator server.");

            while (true) {
                System.out.print("Enter a calculation (operator,operand1,operand2): ");
                String calculation = scanner.nextLine();
                if (calculation.equalsIgnoreCase("exit")) {
                    break;
                }

                out.println(calculation);

                String response = in.readLine();
                System.out.println("Server response: " + response);
            }
        } catch (IOException e) {
            System.err.println("Error connecting to the server: " + e.getMessage());
        }
    }
}