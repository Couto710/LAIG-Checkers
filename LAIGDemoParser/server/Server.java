package server;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.InetSocketAddress;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

public class Server {
	
	private static HttpServer server;
	
	// Checks player
	public static char getPlayer(char[][] board, int x, int y)
	{
		char res = board[y][x];
		
		res = Character.toLowerCase(res);
		
		return res;
	}

	// Breaks request into pieces
	public static String[] breaksRequest(String request)
	{
		String[] res={};
		
		res = request.split("\n");
		
		return res;
	}
	
	// Position to Integer array
 	public static int[] convertPositions(String pos)
	{
		String[] split_pos = pos.split(" ");
		int res[] = new int[2];
		
		for(int i=0; i<split_pos.length; i++)
		{
			res[i] = Integer.parseInt(split_pos[i]);
		}
		
		return res;
	}
	
 	// String to Board
 	private static char[][] stringToBoard(String[] board)
 	{
 		char[][] res = new char[10][10];
 		
 		for(int i=0; i<board.length; i++)
 		{
 			for(int j=0; j<board[i].length(); j++)
 			{
 				res[i][j] = board[i].charAt(j);
 			}
 		}
 		
 		return res;
 	}
 	
	// Converts char[][] to String
	private static String boardToString(char[][] board)
	{
		String res="";
		for(int i=0; i<board.length; i++)
		{
			if(i!=0)
			{
				res+="\n";
			}
			for(int j=0; j<board[i].length; j++)
			{
				res+=String.valueOf(board[i][j]);
			}
		}
		
		return res;
	}
	
	// Check if a piece can eat another
	private static Boolean checkEatingMove(char[][] board, String piece_pos)
	{
		int[] pos_array = convertPositions(piece_pos);
		int piece_x = pos_array[0];
		int piece_y = pos_array[1];
		char piece_char = board[piece_y][piece_x];
		
		switch(piece_char)
		{
		 	case 'W':
		 		if(board[piece_y-1][piece_x-1] == 'B' || board[piece_y-1][piece_x-1] == 'b')
		 		{
		 			if(board[piece_y-2][piece_x-2] == ' ') return true;
		 		}
		 		if(board[piece_y-1][piece_x+1] == 'B' || board[piece_y-1][piece_x+1] == 'b')
		 		{
		 			if(board[piece_y-2][piece_x+2] == ' ') return true;
		 		}
		 		break;
		 	case 'B':
		 		if(board[piece_y+1][piece_x-1] == 'W' || board[piece_y+1][piece_x-1] == 'w')
		 		{
		 			if(board[piece_y+2][piece_x-2] == ' ') return true;
		 		}
		 		if(board[piece_y+1][piece_x+1] == 'W' || board[piece_y+1][piece_x+1] == 'w')
		 		{
		 			if(board[piece_y+2][piece_x+2] == ' ') return true;
		 		}
		 		break;
		 	case 'w':
		 		if(board[piece_y-1][piece_x-1] == 'B' || board[piece_y-1][piece_x-1] == 'b')
		 		{
		 			if(board[piece_y-2][piece_x-2] == ' ') return true;
		 		}
		 		if(board[piece_y-1][piece_x+1] == 'B' || board[piece_y-1][piece_x+1] == 'b')
		 		{
		 			if(board[piece_y-2][piece_x+2] == ' ') return true;
		 		}
		 		if(board[piece_y+1][piece_x-1] == 'B' || board[piece_y+1][piece_x-1] == 'b')
		 		{
		 			if(board[piece_y+2][piece_x-2] == ' ') return true;
		 		}
		 		if(board[piece_y+1][piece_x+1] == 'B' || board[piece_y+1][piece_x+1] == 'b')
		 		{
		 			if(board[piece_y+2][piece_x+2] == ' ') return true;
		 		}
		 		break;
		 	case 'b':
		 		if(board[piece_y-1][piece_x-1] == 'W' || board[piece_y-1][piece_x-1] == 'w')
		 		{
		 			if(board[piece_y-2][piece_x-2] == ' ') return true;
		 		}
		 		if(board[piece_y-1][piece_x+1] == 'W' || board[piece_y-1][piece_x+1] == 'w')
		 		{
		 			if(board[piece_y-2][piece_x+2] == ' ') return true;
		 		}
		 		if(board[piece_y+1][piece_x-1] == 'W' || board[piece_y+1][piece_x-1] == 'w')
		 		{
		 			if(board[piece_y+2][piece_x-2] == ' ') return true;
		 		}
		 		if(board[piece_y+1][piece_x+1] == 'W' || board[piece_y+1][piece_x+1] == 'w')
		 		{
		 			if(board[piece_y+2][piece_x+2] == ' ') return true;
		 		}
		 		break;
		 	default:
		 		return false;
		}
		
		return false;
	}
	
	// Valid move check
 	public static String checkMove(char[][] board_to_check, String curr_pos, String des_pos)
	{
		String res="";
		Boolean eating_move = false;
		
		int curr_pos_x = convertPositions(curr_pos)[0];
		int curr_pos_y = convertPositions(curr_pos)[1];
		
		int des_pos_x = convertPositions(des_pos)[0];
		int des_pos_y = convertPositions(des_pos)[1];
		
		char player = getPlayer(board_to_check, curr_pos_x, curr_pos_y);
		
		Boolean valid = false;
		
		
		// Board limits check
		if((des_pos_x > 0) && (des_pos_x < 9) && (curr_pos_x > 0) && (curr_pos_x < 9))
		{
			if((des_pos_y > 0) && (des_pos_y < 9) && (curr_pos_y > 0) && (curr_pos_y < 9))
			{
				// Current piece checks
				char curr_pos_char = board_to_check[curr_pos_y][curr_pos_x];
				char des_pos_char = board_to_check[des_pos_y][des_pos_x];
				
				switch(curr_pos_char)
				{
					case 'W':
						if(des_pos_char == ' ')
						{
							if(des_pos_y == (curr_pos_y-1))
							{
								if((des_pos_x == curr_pos_x+1) || (des_pos_x == curr_pos_x-1))
								{
									board_to_check[curr_pos_y][curr_pos_x] = ' ';
									
									// Forms a white king 'w'
									if(des_pos_y == 1)
									{
										board_to_check[des_pos_y][des_pos_x] = 'w';
									}
									else // Regular move
									{
										board_to_check[des_pos_y][des_pos_x] = 'W';
									}
									
									valid = true;
									res += boardToString(board_to_check);
									res += "\nVALID";

								}
							}
							else if(des_pos_y == (curr_pos_y-2))
							{
								if(des_pos_x == curr_pos_x+2)
								{
									if(board_to_check[curr_pos_y-1][curr_pos_x+1] == 'B' || board_to_check[curr_pos_y-1][curr_pos_x+1] == 'b')
									{
										board_to_check[curr_pos_y][curr_pos_x] = ' ';
										board_to_check[curr_pos_y-1][curr_pos_x+1] = ' ';
										
										if(des_pos_y == 1)
										{
											// Eating move + white king 'w'
											board_to_check[des_pos_y][des_pos_x] = 'w';
										}
										else
										{
											// Normal eating move
											board_to_check[des_pos_y][des_pos_x] = 'W';
										}
										
										valid = true;
										eating_move = true;
										res += boardToString(board_to_check);
										res += "\nVALID";
									}
								}
								else if(des_pos_x == curr_pos_x-2)
								{
									if(board_to_check[curr_pos_y-1][curr_pos_x-1] == 'B' || board_to_check[curr_pos_y-1][curr_pos_x-1] == 'b')
									{
										board_to_check[curr_pos_y][curr_pos_x] = ' ';
										board_to_check[curr_pos_y-1][curr_pos_x-1] = ' ';
										
										if(des_pos_y == 1)
										{
											// Eating move + white king 'w'
											board_to_check[des_pos_y][des_pos_x] = 'w';
										}
										else 
										{
											// Normal eating move
											board_to_check[des_pos_y][des_pos_x] = 'W';
										}
										
										valid = true;
										eating_move = true;
										res += boardToString(board_to_check);
										res += "\nVALID";
									}
								}
								
							}
						}
						break;
					case 'B':
						if(des_pos_char == ' ')
						{
							if(des_pos_y == (curr_pos_y+1))
							{
								if((des_pos_x == curr_pos_x+1) || (des_pos_x == curr_pos_x-1))
								{
									board_to_check[curr_pos_y][curr_pos_x] = ' ';
									
									if(des_pos_y == 8)
									{
										// Forms a black king 'b'
										board_to_check[des_pos_y][des_pos_x] = 'b';
									}
									else // Regular move
									{
										board_to_check[des_pos_y][des_pos_x] = 'B';
									}
									
									valid = true;
									res += boardToString(board_to_check);
									res += "\nVALID";
								}
							}
							else if(des_pos_y == (curr_pos_y+2))
							{
								if(des_pos_x == curr_pos_x+2)
								{
									if(board_to_check[curr_pos_y+1][curr_pos_x+1] == 'W' || board_to_check[curr_pos_y+1][curr_pos_x+1] == 'w')
									{
										board_to_check[curr_pos_y][curr_pos_x] = ' ';
										board_to_check[curr_pos_y+1][curr_pos_x+1] = ' ';
										
										if(des_pos_y == 8)
										{
											// Eating move + black king 'b'
											board_to_check[des_pos_y][des_pos_x] = 'b';
										}
										else
										{
											// Normal eating move																																														
											board_to_check[des_pos_y][des_pos_x] = 'B';
										}
										
										valid = true;
										eating_move = true;
										res += boardToString(board_to_check);
										res += "\nVALID";
									}
								}
								else if(des_pos_x == curr_pos_x-2)
								{
									if(board_to_check[curr_pos_y+1][curr_pos_x-1] == 'W' || board_to_check[curr_pos_y+1][curr_pos_x-1] == 'w')
									{
										board_to_check[curr_pos_y][curr_pos_x] = ' ';
										board_to_check[curr_pos_y+1][curr_pos_x-1] = ' ';
										
										if(des_pos_y == 8)
										{
											// Eating move + black king 'b'
											board_to_check[des_pos_y][des_pos_x] = 'b';
										}
										else
										{
											// Normal eating move
											board_to_check[des_pos_y][des_pos_x] = 'B';
										}
										
										valid = true;
										eating_move = true;
										res += boardToString(board_to_check);
										res += "\nVALID";
									}
								}
							}
						}
						break;
					case 'w':
						if(des_pos_char == ' ')
						{
							if(des_pos_y == curr_pos_y-1)
							{
								if((des_pos_x == curr_pos_x+1) || (des_pos_x == curr_pos_x-1))
								{
									board_to_check[curr_pos_y][curr_pos_x] = ' ';
									board_to_check[des_pos_y][des_pos_x] = 'w';
									
									valid = true;
									res += boardToString(board_to_check);
									res += "\nVALID";
								}
							
							}
							else if(des_pos_y == curr_pos_y+1)
							{
								if((des_pos_x == curr_pos_x+1) || (des_pos_x == curr_pos_x-1))
								{
									board_to_check[curr_pos_y][curr_pos_x] = ' ';
									board_to_check[des_pos_y][des_pos_x] = 'w';
									
									valid = true;
									res += boardToString(board_to_check);
									res += "\nVALID";
								}
								
							}
							else if(des_pos_y == curr_pos_y-2)
							{
								if(des_pos_x == curr_pos_x-2)
								{
									if(board_to_check[curr_pos_y-1][curr_pos_x-1] == 'B' || board_to_check[curr_pos_y-1][curr_pos_x-1] == 'b')
									{
										board_to_check[curr_pos_y][curr_pos_x] = ' ';
										board_to_check[des_pos_y][des_pos_x] = 'w';
										board_to_check[curr_pos_y-1][curr_pos_x-1] = ' ';
										
										valid = true;
										eating_move = true;
										res += boardToString(board_to_check);
										res += "\nVALID";
									}
								}
								else if(des_pos_x == curr_pos_x+2)
								{
									if(board_to_check[curr_pos_y-1][curr_pos_x+1] == 'B' || board_to_check[curr_pos_y-1][curr_pos_x+1] == 'b')
									{
										board_to_check[curr_pos_y][curr_pos_x] = ' ';
										board_to_check[des_pos_y][des_pos_x] = 'w';
										board_to_check[curr_pos_y-1][curr_pos_x+1] = ' ';
										
										valid = true;
										eating_move = true;
										res += boardToString(board_to_check);
										res += "\nVALID";
									}
								}
							}
							else if(des_pos_y == curr_pos_y+2)
							{
								if(des_pos_x == curr_pos_x-2)
								{
									if(board_to_check[curr_pos_y+1][curr_pos_x-1] == 'B' || board_to_check[curr_pos_y+1][curr_pos_x-1] == 'b')
									{
										board_to_check[curr_pos_y][curr_pos_x] = ' ';
										board_to_check[des_pos_y][des_pos_x] = 'w';
										board_to_check[curr_pos_y+1][curr_pos_x-1] = ' ';
										
										valid = true;
										eating_move = true;
										res += boardToString(board_to_check);
										res += "\nVALID";
									}
								}
								else if(des_pos_x == curr_pos_x+2)
								{									
									if(board_to_check[curr_pos_y+1][curr_pos_x+1] == 'B' || board_to_check[curr_pos_y+1][curr_pos_x+1] == 'b')
									{
										board_to_check[curr_pos_y][curr_pos_x] = ' ';
										board_to_check[des_pos_y][des_pos_x] = 'w';
										board_to_check[curr_pos_y+1][curr_pos_x+1] = ' ';
										
										valid = true;
										eating_move = true;
										res += boardToString(board_to_check);
										res += "\nVALID";
									}
									
								}
							}
						}
						break;
					case 'b':
						if(des_pos_char == ' ')
						{
							if(des_pos_y == curr_pos_y-1)
							{
								if((des_pos_x == curr_pos_x+1) || (des_pos_x == curr_pos_x-1))
								{
									board_to_check[curr_pos_y][curr_pos_x] = ' ';
									board_to_check[des_pos_y][des_pos_x] = 'b';
									
									valid = true;
									res += boardToString(board_to_check);
									res += "\nVALID";
								}
							
							}
							else if(des_pos_y == curr_pos_y+1)
							{
								if((des_pos_x == curr_pos_x+1) || (des_pos_x == curr_pos_x-1))
								{
									board_to_check[curr_pos_y][curr_pos_x] = ' ';
									board_to_check[des_pos_y][des_pos_x] = 'b';
									
									valid = true;
									res += boardToString(board_to_check);
									res += "\nVALID";
								}
								
							}
							else if(des_pos_y == curr_pos_y-2)
							{
								if(des_pos_x == curr_pos_x-2)
								{
									if(board_to_check[curr_pos_y-1][curr_pos_x-1] == 'W' || board_to_check[curr_pos_y-1][curr_pos_x-1] == 'w')
									{
										board_to_check[curr_pos_y][curr_pos_x] = ' ';
										board_to_check[des_pos_y][des_pos_x] = 'b';
										board_to_check[curr_pos_y-1][curr_pos_x-1] = ' ';
										
										valid = true;
										eating_move = true;
										res += boardToString(board_to_check);
										res += "\nVALID";
									}
								}
								else if(des_pos_x == curr_pos_x+2)
								{
									if(board_to_check[curr_pos_y-1][curr_pos_x+1] == 'W' || board_to_check[curr_pos_y-1][curr_pos_x+1] == 'w')
									{
										board_to_check[curr_pos_y][curr_pos_x] = ' ';
										board_to_check[des_pos_y][des_pos_x] = 'b';
										board_to_check[curr_pos_y-1][curr_pos_x+1] = ' ';
										
										valid = true;
										eating_move = true;
										res += boardToString(board_to_check);
										res += "\nVALID";
									}
								}
							}
							else if(des_pos_y == curr_pos_y+2)
							{
								if(des_pos_x == curr_pos_x-2)
								{
									if(board_to_check[curr_pos_y+1][curr_pos_x-1] == 'W' || board_to_check[curr_pos_y+1][curr_pos_x-1] == 'w')
									{
										board_to_check[curr_pos_y][curr_pos_x] = ' ';
										board_to_check[des_pos_y][des_pos_x] = 'b';
										board_to_check[curr_pos_y+1][curr_pos_x-1] = ' ';
										
										valid = true;
										eating_move = true;
										res += boardToString(board_to_check);
										res += "\nVALID";
									}
								}
								else if(des_pos_x == curr_pos_x+2)
								{									
									if(board_to_check[curr_pos_y+1][curr_pos_x+1] == 'W' || board_to_check[curr_pos_y+1][curr_pos_x+1] == 'w')
									{
										board_to_check[curr_pos_y][curr_pos_x] = ' ';
										board_to_check[des_pos_y][des_pos_x] = 'b';
										board_to_check[curr_pos_y+1][curr_pos_x+1] = ' ';
										
										valid = true;
										eating_move = true;
										res += boardToString(board_to_check);
										res += "\nVALID";
									}
									
								}
							}
						}
						break;
					default:
						res+=boardToString(board_to_check);
						res+="\nINVALID";
						break;
				}
			}
		}
		
		if(res == "")
		{
			res += boardToString(board_to_check);
			res += "\nINVALID";
		}
		
		// Check if second Eating move can be performed 
		// Add next player accordingly
		// W or B
		if(!valid || (valid && eating_move && checkEatingMove(board_to_check, des_pos)))
		{
			res += "\n"+player;
		}
		else
		{
			if(player == 'b')
			{
				res += "\nw";
			}
			else res += "\nb";
		}
		
		return res;
	}

	public static void main(String[] args)
	{			
		// Stores arguments from command on variables
		int port = 8001;
		
		try {
			server =  HttpServer.create(new InetSocketAddress(InetAddress.getByName("localhost"),port), 0);
			System.out.println("@Server:properly created server");
		} catch (IOException e) {
			System.out.println("@Server:error creating server: "+e);
			e.printStackTrace();
		}
		
		server.createContext("/", new RequestHandler());
		server.setExecutor(null);
        server.start();
	}
	
	public static class RequestHandler implements HttpHandler {
		@Override
		public void handle(HttpExchange request) throws IOException {
			String response = scanRequest(request);
			int code = 200;
			
			try {
				request.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
				request.sendResponseHeaders(code, response.length());
				OutputStream os = request.getResponseBody();
				os.write(response.getBytes());
				os.close();
			}catch (IOException e) {
				e.printStackTrace();
				System.out.print("@Server:error sending response\n");
			}
		}	
	}	
	
	private static String scanRequest(HttpExchange request)
	{
		String method = request.getRequestMethod();
		String body = InStreamToString(request.getRequestBody());
		
		String answer = "";
		
		if(method.equals("POST"))
		{
			String[] strReqBody = breaksRequest(body);
			
			String[] board_init = new String[10];
			board_init[0] = strReqBody[0];
			board_init[1] = strReqBody[1];
			board_init[2] = strReqBody[2];
			board_init[3] = strReqBody[3];
			board_init[4] = strReqBody[4];
			board_init[5] = strReqBody[5];
			board_init[6] = strReqBody[6];
			board_init[7] = strReqBody[7];
			board_init[8] = strReqBody[8];
			board_init[9] = strReqBody[9];
			String curr_pos = strReqBody[10];
			String des_pos = strReqBody[11];
			
			// Handles request parts and it builds a proper response
			char[][] board = stringToBoard(board_init);
			
			answer = checkMove(board, curr_pos, des_pos);
			
		}
		return answer;
	}
	
	private static String InStreamToString(InputStream is) {
		 
		BufferedReader br = null;
		StringBuilder sb = new StringBuilder();
 
		String line;
		try {
 
			br = new BufferedReader(new InputStreamReader(is));
			while ((line = br.readLine()) != null) {
				sb.append(line);
				sb.append("\n");
			}
 
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (br != null) {
				try {
					br.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return sb.toString();
	}

}