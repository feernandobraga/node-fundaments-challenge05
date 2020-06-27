import { Router } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';

const transactionRouter = Router();

const transactionsRepository = new TransactionsRepository();

/**
 * the get method will:
 * 1. call the method .all from the repository
 * 2. return the response in json format
 */
transactionRouter.get('/', (request, response) => {
  try {
    const transactions = transactionsRepository.all();
    const balance = transactionsRepository.getBalance();

    return response.json({
      transactions,
      balance,
    });
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

/**
 * Method post will:
 * 1. get the title, value and type from the API body
 * 2. pass the value from the already instantiated object transactionRepository to the transactionService
 * 3. call the execute method from the transactionService with the values received from the API
 * 4. send the json response back to the user
 */
transactionRouter.post('/', (request, response) => {
  try {
    // receives title value and type from the API call's body
    const { title, value, type } = request.body;

    // passing the value of already initiated transactions to the service
    const createTransaction = new CreateTransactionService(
      transactionsRepository,
    );

    // calls the execute method from the service and passes title, value and type
    const transaction = createTransaction.execute({
      title,
      value,
      type,
    });

    // sends the response back to the user
    return response.json(transaction);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default transactionRouter;
