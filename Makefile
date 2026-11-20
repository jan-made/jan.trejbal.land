.PHONY: securityVerify

securityVerify: security
	gpg --verify public/.well-known/security.txt.sig public/.well-known/security.txt

security:
	gpg --default-key 7095AA73C194BD6057E96A91A68FC82122582BBD --armor --output public/.well-known/security.txt.sig --detach-sign public/.well-known/security.txt
