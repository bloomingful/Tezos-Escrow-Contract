# Escrow - Example for illustrative purposes only.

import smartpy as sp

class Escrow(sp.Contract):
    def __init__(self, admin, owner, fromOwner, counterparty, fromCounterparty, epoch, hashedSecret):
        self.init(fromOwner             = fromOwner,
                  fromCounterparty      = fromCounterparty,
                  depositedOwner        = False, # a boolean whether the owner has already deposited or not, initialized to False
                  depositedCounterparty = False, # a boolean whether the counterparty has already deposited or not, initialized to False
                  balanceOwner          = sp.tez(0),
                  balanceCounterparty   = sp.tez(0),
                  withdrewOwner         = False, # a boolean whether the owner wishes to withdraw from contract or not, initialized to False
                  withdrewCounterparty  = False, # a boolean whether the counterparty wishes to withdraw from contract or not, initialized to False
                  hashedSecret          = hashedSecret,
                  epoch                 = epoch, 
                  admin                 = admin, # adress of the admin that authorizes withdrawals
                  owner                 = owner,
                  counterparty          = counterparty)

    @sp.entry_point
    def addBalanceOwner(self):
        sp.verify(sp.sender == self.data.owner, "You are not the owner of the contact. Only the owner can use this command.") # verify whether the user is the Owner
        sp.verify(self.data.balanceOwner == sp.tez(0), "You have already a pending balance in the contract. Please ensure that it is your first time depositing.")
        sp.verify(sp.amount == self.data.fromOwner, "Inappropriate amount. Please check the correct amount to deposit.")
        self.data.balanceOwner = self.data.fromOwner
        self.data.depositedOwner = True # Owner has already deposited: depositedOwner -> True

    @sp.entry_point
    def addBalanceCounterparty(self):
        sp.verify(sp.sender == self.data.counterparty, "You are not the counterparty of the contact. Only the counterparty can use this commnand.")
        sp.verify(self.data.balanceCounterparty == sp.tez(0), "You have already a pending balance in the contract. Please ensure that it is your first time depositing.")
        sp.verify(sp.amount == self.data.fromCounterparty, "Inappropriate amount. Please check the correct amount to deposit.")
        self.data.balanceCounterparty = self.data.fromCounterparty
        self.data.depositedCounterparty = True # Counterparty has already deposited: depositedCounterparty -> True

    def claim(self, identity):
        sp.verify(sp.sender == identity)
        sp.verify(self.data.depositedOwner == True, "The owner (and/or the counterparty) has not yet deposited to the contract. The amount cannot be claimed yet.") # verify whether Owner has already deposited to escrow
        sp.verify(self.data.depositedCounterparty == True, "The counterparty has not yet deposited to the contract. The amount cannot be claimed yet.") # verify whether Counterparty has already deposited to escrow
        sp.send(identity, self.data.balanceOwner + self.data.balanceCounterparty)
        
        self.data.balanceOwner = sp.tez(0)
        self.data.balanceCounterparty = sp.tez(0)
        
        self.data.depositedOwner = False # revert depositedOwner to False
        self.data.depositedCounterparty = False # revert depositedCounterparty to False

    @sp.entry_point
    def claimCounterparty(self, params):
        # counterparty can immediately claim the fund once both parties deposited, i.e. no epoch requirement.
        sp.verify(self.data.hashedSecret == sp.blake2b(params.secret), "Incorrect secret key.")
        self.claim(self.data.counterparty)

    @sp.entry_point
    def claimOwner(self):
        sp.verify(self.data.epoch < sp.now) # owner can claim the fund after a specific epoch.
        self.claim(self.data.owner)

    @sp.entry_point
    def withdrawOwner(self):
        sp.verify(sp.sender == self.data.owner, "You are not the owner of the contact. Only the owner can use this command.") # verify whether the user is the Owner
        sp.verify(self.data.withdrewOwner == False, "You are already withdrawing from the contract. There's no need to execute withdraw command again.")
        self.data.withdrewOwner = True

    @sp.entry_point
    def undoWithdrawOwner(self):
        sp.verify(sp.sender == self.data.owner, "You are not the owner of the contact. Only the owner can use this command.") # verify whether the user is the Owner
        sp.verify(self.data.withdrewOwner == True, "You are not originally withdrawing from the contract. There's no need to undo.")
        self.data.withdrewOwner = False
        
    @sp.entry_point
    def withdrawCounterparty(self):
        sp.verify(sp.sender == self.data.counterparty, "You are not the counterparty of the contact. Only the counterparty can use this command.") # verify whether the user is the Counterparty
        sp.verify(self.data.withdrewCounterparty == False, "You are already withdrawing from the contract. There's no need to execute withdraw command again.")
        self.data.withdrewCounterparty = True

    @sp.entry_point
    def undoWithdrawCounterparty(self):
        sp.verify(sp.sender == self.data.counterparty, "You are not the counterparty of the contact. Only the counterparty can use this command.") # verify whether the user is the Counterparty
        sp.verify(self.data.withdrewCounterparty == True, "You are not originally withdrawing from the contract. There's no need to undo.")
        self.data.withdrewCounterparty = False

    @sp.entry_point
    def authAdmin(self):
        sp.verify(sp.sender == self.data.admin, "You are not the admin of the contact. Only the admin can can authorize withdrawal..") # verify whether the user is the Admin
        sp.verify(self.data.withdrewOwner == True, "The owner (and/or counterparty) has not yet withdrawn from the contract. Withdrawal cannot be authorized yet.") # verify whether Owner has already deposited to escrow
        sp.verify(self.data.withdrewCounterparty == True, "The counterparty has not yet withdrawn from the contract. Withdrawal cannot be authorized yet.") # verify whether Counterparty has already deposited to escrow
        
        sp.send(self.data.owner, self.data.fromOwner) # send the deposited amount of Owner back to them
        sp.send(self.data.counterparty, self.data.fromCounterparty) # send the deposited amount of Counterparty back to them

        self.data.depositedOwner = False # revert depositedOwner to False
        self.data.depositedCounterparty = False # revert depositedCounterparty to False

        self.data.withdrewOwner = False # revert withdrawOwner to False
        self.data.withdrewCounterparty = False # revert withdrawCounterparty to False

        self.data.balanceOwner = sp.tez(0)
        self.data.balanceCounterparty = sp.tez(0)

    
@sp.add_test(name = "Escrow")
def test():
    scenario = sp.test_scenario()

    # Test Accounts
    admin = sp.test_account("Admin") # admin
    alice = sp.test_account("Alice") # owner
    bob = sp.test_account("Bob") # counterparty

    # Secret key
    hashSecret = sp.blake2b(sp.bytes("0x01223344"))

    scenario.h1("Escrow")
    
    # Contract instance
    escrow = Escrow(admin.address, alice.address, sp.tez(50), bob.address, sp.tez(4), sp.timestamp(1681658582), hashSecret)
    scenario += escrow

    ###############################
    
    scenario.h2("TRANSACTION 1")
    scenario += escrow.addBalanceOwner().run(sender = alice, amount = sp.tez(50))

    scenario.h3("Premature claim")
    scenario += escrow.claimCounterparty(secret = sp.bytes("0x01223344")).run(sender = bob, valid = False)
    
    scenario += escrow.addBalanceCounterparty().run(sender = bob, amount = sp.tez(4))
    
    scenario.h3("Valid claim")
    scenario += escrow.claimCounterparty(secret = sp.bytes("0x01223344")).run(sender = bob)
    
    ###############################
    
    scenario.h2("TRANSACTION 2")
    scenario += escrow.addBalanceOwner().run(sender = alice, amount = sp.tez(50))
    scenario += escrow.addBalanceCounterparty().run(sender = bob, amount = sp.tez(4))
    
    scenario.h3("Erronous secret")
    scenario += escrow.claimCounterparty(secret = sp.bytes("0x01223343")).run(sender = bob, valid = False)
    
    scenario.h3("Correct secret")
    scenario += escrow.claimCounterparty(secret = sp.bytes("0x01223344")).run(sender = bob)
    
    ###############################
    
    scenario.h2("TRANSACTION 3")
    scenario += escrow.addBalanceOwner().run(sender = alice, amount = sp.tez(50))
    scenario += escrow.addBalanceCounterparty().run(sender = bob, amount = sp.tez(4))

    scenario += escrow.withdrawOwner().run(sender = alice)

    scenario.h3("Invalid withdrawal authorization")
    scenario += escrow.authAdmin().run(sender = admin, valid = False)

    scenario += escrow.withdrawCounterparty().run(sender = bob)

    scenario.h3("Valid withdrawal authorization")
    scenario += escrow.authAdmin().run(sender = admin)

    ###############################

sp.add_compilation_target("escrow", Escrow(sp.address("tz1RQ8B4cUT9xq12LyLww1Mtpv7eCZcjc2xT"), sp.address("tz1MXVBitnteZLvyXKcYg4WABiNNQwveuu3j"), sp.tez(50), sp.address("tz1ZhfSu5vmPbJ8d4xfLnAT8pReSnK4DaWFQ"), sp.tez(4), sp.timestamp(1681480003), sp.bytes("0xc2e588e23a6c8b8192da64af45b7b603ac420aefd57cc1570682350154e9c04e")))