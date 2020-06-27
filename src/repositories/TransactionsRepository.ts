import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

// interface used to get the files coming from the service
interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  /**
   * The method get balance will use the reduce method. The reduce method gets two parameters:
   * 1. an accumulator, which is basically an object that holds its value through all reduce iterations
   * 2. the value for each array element (as if it was a map)
   * We can also pass how the accumulator object looks like. In this case it has income, outcome and total.
   * So we loop through each array element and execute a switch case based on the transaction type:
   *  - if it's of type income, it adds to income value
   *  - if it's of type outcome, adds to the outcome value
   */
  public getBalance(): Balance {
    const balance = this.transactions.reduce(
      (accumulator: Balance, transaction: Transaction) => {
        switch (transaction.type) {
          case 'income':
            accumulator.income += transaction.value;
            break;
          case 'outcome':
            accumulator.outcome += transaction.value;
            break;
          default:
            break;
        }
        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    // now we deconstruc the balance object to get the values of income and outcome and the subtract it from each other to get the total.
    // then we update the total value from the balance
    const { income, outcome } = balance;
    const total = income - outcome;
    balance.total = total;

    return balance;
  }

  /**
   * Method called from the CreateTransactionService.execute(). It get the elements that were passed
   * then it creates a new transaction object, pushes that into the array of transactions and finally return the transaction
   */
  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({
      title,
      value,
      type,
    });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
