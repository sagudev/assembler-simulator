#CFLAGS := -Wall -W -std=c89

all: cucu-cc

cucu-cc: cucu.o
	$(CC) -o $@ $<

cucu.o: cucu.c gen.c
	$(CC) -c $< -DGEN=\"gen.c\" -o $@

install: cucu-cc
	cp cucu-cc ..

clean:
	rm -f cucu
	rm -f *.o

.PHONY: all
