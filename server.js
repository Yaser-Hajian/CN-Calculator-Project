import java.io.*;
import java.net.*;
import java.util.concurrent.*;

public class CalculatorServer {
    private static final int PORT = 5000;

    public static void main(String[] args) {
        ExecutorService executorService = Executors.newCachedThreadPool();
        try (ServerSocket serverSocket = new ServerSocket(PORT)) {
            System.out.println("Calculator server started. Waiting for clients...");

            while (true) {
                Socket clientSocket = serverSocket.accept();
                executorService.submit(new ClientHandler(clientSocket));
            }
        } catch (IOException e) {
            System.err.println("Error starting the server: " + e.getMessage());
        } finally {
            executorService.shutdown();
        }
    }

    static class ClientHandler implements Runnable {
        private Socket clientSocket;

        public ClientHandler(Socket clientSocket) {
            this.clientSocket = clientSocket;
        }

        @Override
        public void run() {
            try (BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
                 PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true)) {

                String input;
                while ((input = in.readLine()) != null) {
                    String[] tokens = input.split(",");
                    if (tokens.length != 3) {
                        out.println("Invalid input format. Expected: operator,operand1,operand2");
                        continue;
                    }

                    String operator = tokens[0].trim();
                    double operand1 = Double.parseDouble(tokens[1].trim());
                    double operand2 = Double.parseDouble(tokens[2].trim());

                    double result;
                    long startTime = System.nanoTime();
                    switch (operator) {
                        case "+":
                            result = operand1 + operand2;
                            break;
                        case "-":
                            result = operand1 - operand2;
                            break;
                        case "*":
                            result = operand1 * operand2;
                            break;
                        case "/":
                            if (operand2 == 0) {
                                out.println("Cannot divide by zero");
                                continue;
                            }
                            result = operand1 / operand2;
                            break;
                        default:
                            out.println("Invalid operator. Supported operators: +, -, *, /");
                            continue;
                    }

                    long endTime = System.nanoTime();
                    long duration = TimeUnit.NANOSECONDS.toMillis(endTime - startTime);
                    out.printf("Result: %.2f, Calculation time: %d ms%n", result, duration);
                }
            } catch (IOException e) {
                System.err.println("Error communicating with the client: " + e.getMessage());
            } finally {
                try {
                    clientSocket.close();
                } catch (IOException e) {
                    System.err.println("Error closing client socket: " + e.getMessage());
                }
            }
        }
    }
}