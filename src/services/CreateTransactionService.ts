import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  /**
   * the execute method is called from the the routes and passes the value that are coming from the API body.
   * The method executes some business validations and then call the create method from the repository.
   * The transaction then is handled by the repository and whatever is return, we return back to the routes
   */
  public execute({ title, value, type }: Request): Transaction {
    if (!title || !value || !type) {
      throw Error('You must include a title, a value and a type');
    }

    /**
     * if the transaction is of outcome type we need to check if we have enough balance.
     * first, we get the total from the balance object and we compare if the value of the transaction is greater than the total
     * if the value is greater than the total, we throw an error
     */
    if (type === 'outcome') {
      const { total } = this.transactionsRepository.getBalance();
      if (value > total) {
        throw new Error('You cannot afford that');
      }
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });
    return transaction;
  }
}

export default CreateTransactionService;
